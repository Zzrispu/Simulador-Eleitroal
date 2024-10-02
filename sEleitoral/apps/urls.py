from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("", views.cadidatos, name="index"),
    path("urna", views.urna, name='urna'),
    path('resultado', views.resultado, name='Resultado'),
    path('vote', views.vote, name='vote'),
    path('mesario', views.mesario, name='mesario'),
    path('validar', views.validar, name='validar'),
    path('checar', views.checar, name='checar'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)