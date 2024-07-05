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

        // Ajoutez ici d'autres méthodes pour gérer les actions spécifiques que votre application nécessite
    }
}
