targetScope = 'resourceGroup'

@description('Name of the existing Cosmos DB account')
param cosmosAccountName string

@description('Name for the Static Web App')
param staticWebAppName string = 'prep-tracker-app'

@description('Location for the Static Web App')
param swaLocation string = 'centralus'

@description('Location for Cosmos DB resources (must match existing account)')
param cosmosLocation string = resourceGroup().location

module cosmosDb 'modules/cosmosDatabase.bicep' = {
  name: 'cosmos-database'
  params: {
    cosmosAccountName: cosmosAccountName
    location: cosmosLocation
  }
}

module swa 'modules/staticWebApp.bicep' = {
  name: 'static-web-app'
  params: {
    name: staticWebAppName
    location: swaLocation
  }
}

output staticWebAppHostname string = swa.outputs.defaultHostname
output cosmosDatabase string = cosmosDb.outputs.databaseName
