# Generated by Django 5.1 on 2024-09-24 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cadidato',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=100)),
                ('numero', models.BigIntegerField(verbose_name='número_identificador')),
                ('votos', models.BigIntegerField(verbose_name='votos')),
            ],
        ),
        migrations.CreateModel(
            name='Eleitor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=100)),
                ('matricula', models.BigIntegerField(verbose_name='matricula')),
                ('votou', models.BooleanField()),
            ],
        ),
    ]
