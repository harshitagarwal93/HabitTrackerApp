@description('Name of the existing Cosmos DB account')
param cosmosAccountName string

@description('Location for the resources')
param location string = resourceGroup().location

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' existing = {
  name: cosmosAccountName
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-11-15' = {
  parent: cosmosAccount
  name: 'PrepTracker'
  properties: {
    resource: {
      id: 'PrepTracker'
    }
  }
}

resource planItemsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-11-15' = {
  parent: database
  name: 'planItems'
  properties: {
    resource: {
      id: 'planItems'
      partitionKey: {
        paths: ['/userId']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          { path: '/*' }
        ]
        compositeIndexes: [
          [
            { path: '/userId', order: 'ascending' }
            { path: '/trackId', order: 'ascending' }
            { path: '/order', order: 'ascending' }
          ]
        ]
      }
    }
  }
}

resource userStatsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-11-15' = {
  parent: database
  name: 'userStats'
  properties: {
    resource: {
      id: 'userStats'
      partitionKey: {
        paths: ['/userId']
        kind: 'Hash'
      }
    }
  }
}

output databaseName string = database.name
