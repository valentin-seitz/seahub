# Copyright (c) 2012-2018 Seafile Ltd.
# -*- coding: utf-8 -*-
import logging

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from seahub.api2.authentication import TokenAuthentication
from seahub.api2.throttling import UserRateThrottle
from seahub.api2.utils import api_error
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

        pdf_path = html2pdf(content)
        if pdf_path is None:
            assert False, 'TODO'

        with open(pdf_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="application/pdf")
            response["Content-Disposition"] = "attachment; filename=\"%s\"" % "test.pdf"
            return response
