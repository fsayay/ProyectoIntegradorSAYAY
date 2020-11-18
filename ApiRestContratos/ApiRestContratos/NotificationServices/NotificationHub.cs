using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiRestContratos.NotificationServices
{
    public class NotificationHub : Hub
    {
        public Task SendToConnection(string message)
        {
            return Clients.Caller.SendAsync("Send", $"Private message from {Context.ConnectionId}: {message}");
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }
    }
}