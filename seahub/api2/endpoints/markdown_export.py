# Copyright (c) 2012-2018 Seafile Ltd.
# -*- coding: utf-8 -*-
import logging
import re

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from seaserv import seafile_api

from seahub.api2.authentication import TokenAuthentication
from seahub.api2.throttling import UserRateThrottle
from seahub.api2.utils import api_error
from seahub.utils import gen_inner_file_get_url, get_service_url
from seahub.utils.html2pdf import html2pdf

logger = logging.getLogger(__name__)


class MarkdownExportView(APIView):
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticated, )
    throttle_classes = (UserRateThrottle, )  # TODO: 5 calls per min

    def post(self, request):
        content = request.data.get('content', '')
        if not content:
            error_msg = 'content invalid.'
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)

        def repl(matchobj):
            repo_id = matchobj.group(1)
            img_path = '/' + matchobj.group(2).split('?')[0]

            obj_id = seafile_api.get_file_id_by_path(repo_id, img_path)
            if not obj_id:
                return 'src="#"'

            access_token = seafile_api.get_fileserver_access_token(
                repo_id, obj_id, 'view', '', use_onetime=True
            )
            url = gen_inner_file_get_url(access_token, img_path.split('/')[-1])
            return 'src="%s"' % url

        new_content = re.sub('src="%s/lib/([-0-9a-f]{36})/file/(.*)"' % get_service_url().rstrip('/'), repl, content)

        pdf_path = html2pdf(new_content)
        if pdf_path is None:
            assert False, 'TODO'

        with open(pdf_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="application/pdf")
            response["Content-Disposition"] = "attachment; filename=\"%s\"" % "test.pdf"
            return response
