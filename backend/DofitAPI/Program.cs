using DofitAPI.Models;
using DofitAPI.Services;
using DofitAPI.Swagger;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => { options.DocumentFilter<PathPrefixInsertDocumentFilter>("/api"); });

builder.Services.Configure<DofitDatabaseSettings>(builder.Configuration.GetSection("DofitDatabase"));
builder.Services.AddSingleton<ItemsService>();
builder.Services.AddSingleton<SellsService>();

//services cors
builder.Services.AddCors(p =>
    p.AddPolicy("corsapp", builder => { builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader(); }));

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();


app.UseCors("corsapp");
app.UseHttpsRedirection();
app.UseAuthorization();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();