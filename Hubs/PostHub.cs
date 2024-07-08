using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace api.Hubs
{
    public class PostHub :Hub
    {
        // Méthode appelée lorsque qu'un client se connecte au hub
        public override Task OnConnectedAsync()
        {
            // Logique à exécuter lorsqu'un client se connecte
            Console.WriteLine("Connexion à PostHub");
            return base.OnConnectedAsync();
        }

        // Méthode appelée lorsque qu'un client se déconnecte du hub
        public override Task OnDisconnectedAsync(Exception exception)
        {
            // Logique à exécuter lorsqu'un client se déconnecte
            Console.WriteLine("Deconnexion à PostHub");
            return base.OnDisconnectedAsync(exception);
        }

        // Méthode pour envoyer un message à tous les clients connectés
        public async Task SendPost(string user, string message)
        {
            await Clients.All.SendAsync("receivedPost", user, message);
        }
    }
}