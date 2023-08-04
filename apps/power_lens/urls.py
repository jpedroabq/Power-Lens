from django.urls import path
from . import views

urlpatterns = [
    path('cadastro/', views.cadastro, name='cadastro'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('save_graph/', views.save_graph_to_session, name='save_graph'),
    path('retrieve_graph/', views.retrieve_graph_from_session, name='retrieve_graph'),
    path('clear_graphs/', views.clear_graphs, name='clear_graphs'),
]   