using Microsoft.AspNetCore.Hosting;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Collections.Generic;
using System.Fabric;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace SInnovations.ServiceFabric.SignalRBroadCasterService
{
    public class Program
    {
        // Entry point for the application.
        public static void Main(string[] args)
        {
            if (args.Any(k => k == "--fabric"))
            {
                ServiceRuntime.RegisterServiceAsync("SignalRBroadCasterServiceType", context => new WebHostingService(context, "ServiceEndpoint")).GetAwaiter().GetResult();

               Thread.Sleep(Timeout.Infinite);
            }
            else
            {


                var host = new WebHostBuilder()
                   .UseKestrel()
                   .UseContentRoot(Directory.GetCurrentDirectory())
                   .UseIISIntegration()
                   .UseStartup<Startup>()
                   .Build();

                host.Run();
            }

        
        }

        /// <summary>
        /// A specialized stateless service for hosting ASP.NET Core web apps.
        /// </summary>
        internal sealed class WebHostingService : StatelessService, ICommunicationListener
        {
            private readonly string _endpointName;

            private IWebHost _webHost;

            public WebHostingService(StatelessServiceContext serviceContext, string endpointName)
                : base(serviceContext)
            {
                _endpointName = endpointName;
            }

            #region StatelessService

            protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
            {
                return new[] { new ServiceInstanceListener(_ => this) };
            }

            #endregion StatelessService

            #region ICommunicationListener

            void ICommunicationListener.Abort()
            {
                _webHost?.Dispose();
            }

            Task ICommunicationListener.CloseAsync(CancellationToken cancellationToken)
            {
                _webHost?.Dispose();

                return Task.FromResult(true);
            }

            Task<string> ICommunicationListener.OpenAsync(CancellationToken cancellationToken)
            {
                var endpoint = FabricRuntime.GetActivationContext().GetEndpoint(_endpointName);
                var tries = 10;
                while (tries-- > 0)
                {
                    try
                    {
                        string serverUrl = $"{endpoint.Protocol}://{FabricRuntime.GetNodeContext().IPAddressOrFQDN}:{endpoint.Port - (tries - 10)}";

                        _webHost = new WebHostBuilder().UseKestrel()
                                                       .UseContentRoot(Directory.GetCurrentDirectory())
                                                       .UseStartup<Startup>()
                                                       .UseUrls(serverUrl)
                                                       .Build();

                        _webHost.Start();

                        return Task.FromResult(serverUrl);
                    }
                    catch (Exception ex)
                    {

                    }
                }

                throw new NotImplementedException();
            }

            #endregion ICommunicationListener
        }
    }
}
