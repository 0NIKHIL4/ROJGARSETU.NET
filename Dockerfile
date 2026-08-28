# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["backend/RojgarSetu.Api/RojgarSetu.Api.csproj", "backend/RojgarSetu.Api/"]
RUN dotnet restore "backend/RojgarSetu.Api/RojgarSetu.Api.csproj"
COPY . .
WORKDIR "/src/backend/RojgarSetu.Api"
RUN dotnet build "RojgarSetu.Api.csproj" -c Release -o /app/build
RUN dotnet publish "RojgarSetu.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV PORT=5000
ENV ASPNETCORE_URLS=http://+:${PORT}
EXPOSE 5000
ENTRYPOINT ["dotnet", "RojgarSetu.Api.dll"]
