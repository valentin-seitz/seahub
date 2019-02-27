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
<h2 id="user-content-architecture-vision">Architecture Vision</h2>
<p><a href="https://openedx.atlassian.net/wiki/spaces/AC/pages/921895082/Architecture+Vision">https://openedx.atlassian.net/wiki/spaces/AC/pages/921895082/Architecture+Vision</a></p>
<h3 id="user-content-bounded-contexts-maturity-model">Bounded Contexts Maturity Model</h3>
<p>最终状态是物理隔离的 microservice 容器<br>
  <img src="https://dev.seafile.com/seahub/lib/2e6df407-1e92-4826-921b-e9419cf11478/file/images/auto-upload/image-1548816009234.png?raw=1">
</p>
<h3 id="user-content-rest-api-trichotomy-proposal">REST API Trichotomy Proposal</h3>
<p>不同场景下的 REST API 设计</p>
<p>
  <img src="https://dev.seafile.com/seahub/lib/2e6df407-1e92-4826-921b-e9419cf11478/file/images/auto-upload/image-1548410441613.png?raw=1">
</p>
<h3 id="user-content-可扩展的／可插拔的平台">可扩展的／可插拔的平台</h3>
<p>
  <img src="https://dev.seafile.com/seahub/lib/2e6df407-1e92-4826-921b-e9419cf11478/file/images/auto-upload/image-1548932020904.png?raw=1">
</p>
<p><strong>Micro-frontend:</strong> <a href="https://micro-frontends.org/">https://micro-frontends.org/</a></p>
<h3 id="user-content-认证">认证</h3>
<p>
  <img src="https://dev.seafile.com/seahub/lib/2e6df407-1e92-4826-921b-e9419cf11478/file/images/auto-upload/image-1548932052982.png?raw=1">
</p>
<h3 id="user-content-授权">授权</h3>
<p>TODO</p>
<h2 id="user-content-edx-术语">edx 术语</h2>
<p><a href="https://openedx.atlassian.net/wiki/spaces/AC/pages/28967341/EdX+Glossary">https://openedx.atlassian.net/wiki/spaces/AC/pages/28967341/EdX+Glossary</a></p>
<p>www.edx.org 使用 Drupal 搭建</p>
<p>IDA - Independently Deployable Applications<br>OEP - Open edX Proposal<br>RCA - Root Cause Analysis<br>SFE - SFE stands for Studio Frontend which is a new React/Redux repo for an updated front end for Studio. Repo: <a href="https://github.com/edx/studio-frontend">https://github.com/edx/studio-frontend</a></p>
<h2 id="user-content-how-tos">How-Tos</h2>
<ul>
  <li>
    <p>使用Github API，多个项目里搜索特定字符串：<a href="https://openedx.atlassian.net/wiki/spaces/AC/pages/876052610/How+to%3A+Find+list+of+github+repositories+that+contain+a+string">https://openedx.atlassian.net/wiki/spaces/AC/pages/876052610/How+to%3A+Find+list+of+github+repositories+that+contain+a+string</a></p>
  </li>
  <li>
    <p>重复的耗时操作记录到 Request 对象里，做缓存：<a href="https://openedx.atlassian.net/wiki/spaces/AC/pages/131530793%E2%80%98">https://openedx.atlassian.net/wiki/spaces/AC/pages/131530793‘</a></p>
    <p>代码：<a href="https://github.com/edx/edx-platform/blob/master/openedx/core/lib/cache_utils.py#L14">https://github.com/edx/edx-platform/blob/master/openedx/core/lib/cache_utils.py#L14</a></p>
  </li>
</ul>
<h2 id="user-content-architecture-design-documents">Architecture Design Documents</h2>
<h3 id="user-content-on-boarding-architecture-overview">On-boarding Architecture Overview</h3>
<p><a href="https://docs.google.com/presentation/d/1X3QaSw4sqPLvkXBhC8phoFA7j8dhsL08MCZWwIDMIBE/edit#slide=id.g2c8bd271c1_0_2">https://docs.google.com/presentation/d/1X3QaSw4sqPLvkXBhC8phoFA7j8dhsL08MCZWwIDMIBE/edit#slide=id.g2c8bd271c1_0_2</a></p>
<h2 id="user-content-architecture-notes-and-thoughts">Architecture Notes and Thoughts</h2>
<p><a href="https://openedx.atlassian.net/wiki/spaces/AC/pages/159335117/Development+Best+Practices">Development Best Practices</a></p>
<p><a href="https://openedx.atlassian.net/wiki/spaces/AC/pages/799310705/API+Exploration+Resources">REST API 设计的理念</a></p>'''
