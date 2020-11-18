using ApiRestContratos.Models;
using AspNetCore.Security.CAS;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.IO;
using System.Text;
using WebPush;
using ApiRestContratos.Services;
using ApiRestContratos.NotificationServices;
using System.Threading.Tasks;

namespace ApiRestContratos
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<Microsoft.Extensions.Hosting.IHostedService, EmailNotificationService>();

            services.AddControllers();

            //CORS
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.WithOrigins(Configuration["CorsPolicy"])
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    );
            });

            services.AddSignalR();
            services.AddMemoryCache();

            services.AddMvc().SetCompatibilityVersion(Microsoft.AspNetCore.Mvc.CompatibilityVersion.Latest);

            services.AddControllersWithViews();

            var vapidDetails = new VapidDetails(
                Configuration.GetValue<string>("VapidDetails:Subject"),
                Configuration.GetValue<string>("VapidDetails:PublicKey"),
                Configuration.GetValue<string>("VapidDetails:PrivateKey"));
            services.AddTransient(c => vapidDetails);

            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });


            //Autenticacion
            services.AddAuthentication(options => 
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
                .AddCookie(options =>
                {
                    options.LoginPath = new PathString("/login");
                    options.Cookie = new CookieBuilder { Name = Configuration["AppCookieName"] };                    
                }).AddCAS(options =>
                {
                    options.CasServerUrlBase = Configuration["CasBaseUrl"];
                    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                }).AddJwtBearer(jwtOptions =>
                {
                    jwtOptions.TokenValidationParameters = new TokenValidationParameters()
                    {
                        SaveSigninToken = true,
                        ValidateActor = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["ApiAuth:Issuer"],
                        ValidAudience = Configuration["ApiAuth:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["ApiAuth:SecretKey"]))
                    };
                });

            

            //ORACLE_DB CONNECTION
            //var connection = @"User Id=SYSTEM;Password=admin;Data Source=localhost:1521/xe";
            var connection = @"User Id=" + Configuration["UserDatabase"] + ";Password=" + Configuration["PasswordDatabase"] + ";Data Source=" + Configuration["ServerDatabase"] + "/" + Configuration["SID"];
            services.AddDbContext<MyDBContext>(option => option.UseOracle(connection));

            //Npgsql_DB CONNECTION
            var connectionString = @"User ID=" + Configuration["UserID"] + "; Password =" + Configuration["PasswordNpgqlDB"] + "; Server=" + Configuration["ServerNpgqlDB"] + ";Port=" + Configuration["PortNpgqlDB"] + ";Database=" + Configuration["DataBaseNpgqlDB"] + ";Integrated Security=true; Pooling=true;";
            services.AddDbContext<PgDBContext>(option =>
                option.UseNpgsql(connectionString)
            ); ;

            services.AddControllers().AddNewtonsoftJson();

            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        //public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IDatabaseChangeNotificationService notificationService)
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();           

            app.UseAuthorization();

            app.UseCookiePolicy();

            app.UseStaticFiles();

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                RequestPath = new PathString("/Resources")
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChartHub>("/chart");
                endpoints.MapHub<NotificationHub>("/notification");
                endpoints.MapHub<ChangeDBHub>("/changeDB");
            });
            app.UsePostgreSQLBroker();

        }
    }
}