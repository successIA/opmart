from django.contrib import admin

from opmart.listings.models import Category, Listing, ListingImage

admin.site.register(Category)
admin.site.register(Listing)
admin.site.register(ListingImage)
