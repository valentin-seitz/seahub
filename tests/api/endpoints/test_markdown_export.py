# -*- coding: utf-8 -*-
from django.core.urlresolvers import reverse

from seahub.test_utils import BaseTestCase


class MarkdownExportTest(BaseTestCase):
    def setUp(self):
        self.endpoint = reverse('api-v2.1-markdown-export')
        self.login_as(self.user)

    def test_export(self, ):
        resp = self.client.post(self.endpoint, {
            'content': mock_content,
        })
        self.assertEqual(200, resp.status_code)

mock_content = '''<h2 id="user-content-architecture-learning-resources">Architecture Learning Resources</h2>
<p><a href="https://openedx.atlassian.net/wiki/spaces/AC/pages/921894946/Architecture+Learning+Resources">https://openedx.atlassian.net/wiki/spaces/AC/pages/921894946/Architecture+Learning+Resources</a></p>
<h3 id="user-content-reading-list">Reading list</h3>
<p><a href="https://openedx.atlassian.net/wiki/spaces/AC/pages/679772564/Architecture+Recommended+Reading+List">https://openedx.atlassian.net/wiki/spaces/AC/pages/679772564/Architecture+Recommended+Reading+List</a></p>
<h2 id="user-content-architecture-vision">Architecture Vision</h2>'''
