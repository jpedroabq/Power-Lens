from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect


@login_required(login_url='/auth/login/')
def homePage(request):
    return render(request, 'templates/home.html')

def cadastro(request):
    if request.method == "GET":
        return render(request, 'templates/cadastro.html')
    else:
        username = request.POST.get('username')
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        user = User.objects.filter(username=username).exists()

        if user:
            return HttpResponse("Usuário já existe")
        
        user = User.objects.create_user(username=username, email=email, password=senha)

        return redirect(login)
    
def login(request):
    if request.method == "GET":
        return render(request, 'templates/login.html')
    else:
        username = request.POST.get('username')
        senha = request.POST.get('senha')

        user = authenticate(username=username, password=senha)

        if not user:
            return HttpResponse("Usuário não existe")
        
        if not user.check_password(senha):
            return HttpResponse("Senha incorreta")
        
        login_django(request, user)
        return redirect(homePage)


  
    
