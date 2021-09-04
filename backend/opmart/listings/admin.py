from django.contrib import admin

from opmart.listings.models import Category, Listing

admin.site.register(Category)
admin.site.register(Listing)
