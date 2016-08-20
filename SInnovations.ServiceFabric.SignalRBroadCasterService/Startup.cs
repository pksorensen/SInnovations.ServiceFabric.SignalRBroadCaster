﻿using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Owin;
using SInnovations.ServiceFabric.Gateway.Model;
using SInnovations.ServiceFabric.RegistrationMiddleware.AspNetCore;

namespace SInnovations.ServiceFabric.SignalRBroadCasterService
{
    public class GatewayServiceInformationEx : GatewayServiceInformation
    {
        public bool StickySession { get; set; }
    }
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            app.UseAsServiceFabricGatewayService(new GatewayServiceInformationEx
            {
                 PathPrefix = "/chitchat",
                 StickySession = true
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            app.UseWebSockets();

            //app.Run(async (context) =>
            //{
            //    await context.Response.WriteAsync("Hello World! " + FabricRuntime.GetNodeContext().NodeInstanceId);
            //});

            app.Map("/signalr", signalrApp =>
            {
                signalrApp.UseKatana(config =>
                {
                    config.RunSignalR(new HubConfiguration
                    {
                        EnableDetailedErrors = true,

                    });
                });
            });

            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                ServeUnknownFileTypes = true,
                OnPrepareResponse = context =>
                {
                    context.Context.Response.Headers.Add("Cache-Control", "public, max-age=3600, no-cache");

                }
            });
        }
    }
}
