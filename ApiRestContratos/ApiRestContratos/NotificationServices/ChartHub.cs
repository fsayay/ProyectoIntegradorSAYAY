using ApiRestContratos.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApiRestContratos.NotificationServices
{
    public class ChartHub : Hub
    {
        public async Task BroadcastChartData(List<ChartModel> data)
        {
            await Clients.Caller.SendAsync("broadcastchartdata", data);
        }

        public Task SendToConnection(string message)
        {
            return Clients.All.SendAsync("Send", $"Private message from {Context.ConnectionId}: {message}");
        }
    }
}
