from django.shortcuts import render
from django.core import serializers
from .models import Candidato
from .models import Eleitor
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def cadidatos(request):
    context = {
        'pmc': serializers.serialize('json', Candidato.objects.filter(partido='PMC').order_by('-numero'), fields=["nome", "apelido", "numero", "partido", "cargo", "proposta", "imagem"]),
        'pdc': serializers.serialize('json', Candidato.objects.filter(partido='PDC').order_by('-numero'), fields=["nome", "apelido", "numero", "partido", "cargo", "proposta", "imagem"])
    }
    return render(request, 'candidatos.html', context)

def urna(request):
    context = {
        'context': serializers.serialize('json', Candidato.objects.all(), fields=["apelido", "cargo", "partido", "numero", "imagem"])
    }
    return render(request, 'urna.html', context)

def resultado(request):
    context = {
        'vereadores': serializers.serialize('json', Candidato.objects.filter(cargo='vereador').order_by('-votos'), fields=["nome", "cargo", "partido", "votos"])
    }
    return render(request, 'resultado.html', context)

@csrf_exempt
def vote(request):
    print(request.POST)
    candidato = Candidato.objects.get(numero=request.POST.get('numero'),cargo=request.POST.get('cargo'))
    candidato.votos += 1
    candidato.save()
    print(candidato.apelido)
    return JsonResponse({'teste': 'teste'}, status=200)

matriculas = []
@csrf_exempt
def validar(request):
    if request.method == 'POST':
        print(request.POST.get('matricula'))
        matriculas.append(request.POST.get('matricula'))
        return JsonResponse({'Teste': 'teste'}, status=200)
    else:
        eleitores = []
        for matricula in matriculas:
            eleitores.append(serializers.serialize('json', Eleitor.objects.filter(matricula=matricula)))
        return JsonResponse(eleitores, safe=False, status=200)

aprovados = []
@csrf_exempt
def checar(request):
    if request.method == 'POST':
        print(request.POST.get('aprovado'))
        if request.POST.get('aprovado') == 'true':
            eleitor = Eleitor.objects.get(matricula=request.POST.get('matricula'))
            eleitor.votou = True
            eleitor.save()

            aprovados.append(request.POST.get('matricula'))

            matriculas.remove(request.POST.get('matricula'))
        else:
            matriculas.remove(request.POST.get('matricula'))
        return JsonResponse({'Teste': 'teste'}, status=200)
    else:
        if request.GET.get('matricula'):
            if aprovados.count(request.GET.get('matricula')) > 0:
                aprovados.remove(request.GET.get('matricula'))
                return JsonResponse({'status': 'approved'}, status=200)
            else:
                return JsonResponse({'status': 'denied'}, status=200)
        else:
            return JsonResponse(serializers.serialize('json', Eleitor.objects.filter(votou=True)), safe=False, status=200)


def mesario(request):
    return render(request, 'mesario.html')