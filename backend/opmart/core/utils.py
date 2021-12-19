import os

from django.conf import settings

from imagekit.utils import suggest_extension


def source_name_as_path(generator):
    """
    URL: https://github.com/matthewwithanm/django-imagekit/blob/2106b2e159f0d4a538532caca9654d4b0d8d8700/imagekit/cachefiles/namers.py#L15

    Given
        images/2e/4c/5ff3233527c5ac3e4b596343b440ff67.jpg
    Will return
        CACHE/images/3f/f3/3ff32335e7c5ac3e4b596343b440cc87.jpg"
    """
    source_filename = getattr(generator.source, "name", None)

    cache_dir = settings.IMAGEKIT_CACHEFILE_DIR
    ext = suggest_extension(source_filename or "", generator.format)
    name_hash = generator.get_hash()

    new_path = os.path.join(
        cache_dir, name_hash[:2], name_hash[2:4], "%s%s" % (generator.get_hash(), ext)
    )
    return os.path.normpath(new_path)
