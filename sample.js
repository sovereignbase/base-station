import { BaseStationClient } from './dist/index.js'

const baseStation = new BaseStationClient()

baseStation.invoke({ kind: 'cipherStorePut', detail: {} })
