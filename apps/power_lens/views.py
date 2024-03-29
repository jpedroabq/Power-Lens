# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as logout_django
from django.shortcuts import redirect
from django.contrib.auth import get_user_model

@login_required(login_url='/auth/login/')
def homePage(request):
    return render(request, 'templates/home.html', {'api_tunnel': request.user.api_tunnel})

def landingPage(request):
    return render(request, 'templates/index.html')

def cadastro(request):
    if request.method == "GET":
        return render(request, 'templates/cadastro.html')
    else:
        #username = request.POST.get('username')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        api_tunnel = request.POST.get('api_tunnel')

        User = get_user_model()
        user = User.objects.filter(email=email).exists()

        if user:
            return HttpResponse("Usuário já existe")
        
        user = User.objects.create_user(email=email, password=senha, api_tunnel=api_tunnel)

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

def logout(request):
    if request.method == "POST":
        logout_django(request)
        return redirect(login)
  
def save_graph_to_session(request):
    if request.method == 'POST':
        graph_data = request.POST.get('graph_data')
        query = request.POST.get('query')
        g_type = request.POST.get('g_type')
        c_value = request.POST.get('c_value')
        
        # Retrieve the existing graphs list from the session or create a new empty list
        graphs_list = request.session.get('graphs_list', [])
        
        graphs_list.append({
            # Now store the graph data in the user's session
            'graph_data': graph_data,
            'query': query,
            'g_type': g_type,
            'c_value': c_value
        })
        
        # Update the graphs list in the session
        request.session['graphs_list'] = graphs_list
        request.session.modified = True

        # print saved session as json
        print(request.session.items())
        return JsonResponse({'message': 'Graph data saved successfully.'})

    return JsonResponse({'error': 'Invalid request method.'})

def retrieve_graph_from_session(request):
    graphs_list = request.session.get('graphs_list', [])
    return JsonResponse({'graphs_list': graphs_list})
    
def clear_graphs(request):
    # Remove the graph-related data from the user's session
    if 'graphs_list' in request.session:
        del request.session['graphs_list']

    # You can add more session data to remove if needed

    return redirect(homePage)