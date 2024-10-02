from django.contrib import admin
from .models import Candidato, Eleitor

admin.site.register(Candidato)
admin.site.register(Eleitor)