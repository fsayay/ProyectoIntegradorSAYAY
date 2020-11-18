using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace ApiRestContratos.NotificationServices
{
    public class NotifyHub : Hub
    {
        public async Task SendNotify(string message)
        {
            await Clients.Caller.SendAsync("sendnotify", message);

        }

        public async Task AddToGroup(string group)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
        }

        // Se ejecuta cuando el usuario se conecta
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        // Se ejecuta cuando el usuario se desconecta
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var groups = new string[] { "Chat_Home", "Chat_Sala2" };
            foreach ( var group in groups )
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
            }
            await base.OnDisconnectedAsync(exception);
        }


    }
}
