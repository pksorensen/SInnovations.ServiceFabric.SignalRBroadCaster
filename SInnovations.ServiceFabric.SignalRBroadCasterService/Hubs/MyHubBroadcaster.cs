using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace SInnovations.ServiceFabric.SignalRBroadCasterService.Hubs
{
    public class MyHubBroadcaster : Hub
    {
         public void Test()
        {
            Clients.All.addContosoChatMessageToPage("a", "b");
        }
    }
}
