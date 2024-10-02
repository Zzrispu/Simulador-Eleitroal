from django.db import models

class Candidato(models.Model):
    nome = models.CharField(max_length=50, default='Nome')
    apelido = models.CharField(max_length=50, default='Apelido')
    proposta = models.TextField(max_length=400, default='Proposta')
    cargo = models.CharField(max_length=20, choices={
        "vereador": "Vereador",
        "prefeito": "Prefeito",
        "vice-prefeito": "Vice-Prefeito",
    }, default="vereador")
    numero = models.BigIntegerField('número_identificador')
    partido = models.CharField(max_length=50, choices={
        "PMC": "Partido Marvel Comics",
        "PDC": "Partido Detective Comics",
        "Branco": "branco"
    }, default='Branco')
    imagem = models.ImageField(upload_to='profile', default='candidato_1.jpg')
    votos = models.BigIntegerField('votos', default=0)

class Eleitor(models.Model):
    nome = models.CharField(max_length=100)
    matricula = models.BigIntegerField('matricula')
    votou = models.BooleanField()
