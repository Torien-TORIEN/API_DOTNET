using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace api.Hubs
{
    public class MessageHub : Hub
    {
        // Méthode appelée lorsque qu'un client se connecte au hub
        public override Task OnConnectedAsync()
        {
            // Logique à exécuter lorsqu'un client se connecte
            Console.WriteLine("Connexion à MessageHub");
            return base.OnConnectedAsync();
        }

        // Méthode appelée lorsque qu'un client se déconnecte du hub
        public override Task OnDisconnectedAsync(Exception exception)
        {
            // Logique à exécuter lorsqu'un client se déconnecte
            Console.WriteLine("Deconnexion à MessageHub");
            return base.OnDisconnectedAsync(exception);
        }

        // Méthode pour envoyer un message à tous les clients connectés
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
            
        }

        // Méthode pour envoyer un message à un groupe spécifique
        public async Task SendMessageToGroup(string groupName, string user, string message)
        {
            await Clients.Group(groupName).SendAsync("ReceiveMessage", user, message);
        }

        // Méthode pour ajouter un client à un groupe
        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine(Context.ConnectionId +" added in group :"+groupName);
            //await Clients.Group(groupName).SendAsync("ReceiveMessage", "Admin", $"{Context.ConnectionId} a rejoint le groupe {groupName}.");
        }

        // Méthode pour retirer un client d'un groupe
        public async Task RemoveFromGroup(string groupName)
        {
            Console.WriteLine(Context.ConnectionId +" removed from group :"+groupName);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            //await Clients.Group(groupName).SendAsync("ReceiveMessage", "Admin", $"{Context.ConnectionId} a quitté le groupe {groupName}.");
        }

        // Ajoutez ici d'autres méthodes pour gérer les actions spécifiques que votre application nécessite
    }
}
