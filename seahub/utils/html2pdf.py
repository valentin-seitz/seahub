import codecs
from subprocess import call
import os
import tempfile

from django.conf import settings
from django.template import Template, Context

def html2pdf(html_content):
    cwd = os.getcwd()
    f = codecs.open('media/html5bp/index.html', 'r', 'utf-8')
    base_template = f.read()
    f.close()

    context = Context({
        'content': html_content,
        'baseUrl': 'file://' + os.path.join(cwd, 'media/html5bp'),
    })

    fd, tmp_html_path = tempfile.mkstemp(suffix='.html')
    with os.fdopen(fd, 'w') as tmp:
        tmp.write(Template(base_template).render(context))

    phantomjs = getattr(settings, 'PHANTOMJS_EXE', 'phantomjs')
    tmp_pdf_path = tmp_html_path.split('.')[0] + '.pdf'
    call([phantomjs, "media/phantomjs/config.js", tmp_html_path, tmp_pdf_path])
    return tmp_pdf_path
