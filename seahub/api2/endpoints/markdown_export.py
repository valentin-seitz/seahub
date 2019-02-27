# Copyright (c) 2012-2018 Seafile Ltd.
# -*- coding: utf-8 -*-
import codecs
import json
import logging
from subprocess import call
import os

from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from seahub.api2.authentication import TokenAuthentication
from seahub.api2.throttling import UserRateThrottle
from seahub.api2.utils import api_error

logger = logging.getLogger(__name__)


def generate_pdf(html_content):
    cwd = os.getcwd()
    f = codecs.open('media/html5bp/index.html', 'r', 'utf-8')
    base_template = f.read()

    from django.template import Template, Context

    context = Context({
        'content': html_content,
        'baseUrl': 'file://' + os.path.join(cwd, 'media/html5bp'),
    })

    tmp_html = 'ready_for_generation.html'
    with open(tmp_html, "wb") as fp:
        fp.write(Template(base_template).render(context))

    phantomjs = './node_modules/.bin/phantomjs'
    call([phantomjs, "config.js", tmp_html, "your_PDF.pdf"])

class MarkdownExportView(APIView):
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticated, )
    throttle_classes = (UserRateThrottle, )  # TODO, 5 calls per min

    def post(self, request):
        content = request.data.get('content', '')
        if not content:
            error_msg = 'content invalid.'
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)

        generate_pdf(content)

        return Response({}, status=status.HTTP_200_OK)
