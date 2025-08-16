access(all) contract PrivacyController {
    
    access(all) let PrivacyStoragePath: StoragePath
    access(all) let PrivacyPublicPath: PublicPath
    
    access(all) event HealthDataShared(user: Address, recipient: Address, dataType: String)
    access(all) event PrivacySettingsUpdated(user: Address, setting: String, value: Bool)
    access(all) event PublicGraphPublished(user: Address, graphId: String)
    
    access(all) enum DataType: UInt8 {
        access(all) case Sleep
        access(all) case Steps
        access(all) case HeartRate
        access(all) case BloodPressure
        access(all) case Weight
        access(all) case Goals
        access(all) case Rewards
    }
    
    access(all) enum ShareLevel: UInt8 {
        access(all) case Private
        access(all) case Family
        access(all) case Medical
        access(all) case Public
    }
    
    access(all) struct PrivacySetting {
        access(all) let dataType: DataType
        access(all) var shareLevel: ShareLevel
        access(all) var authorizedUsers: [Address]
        access(all) var allowPublicGraph: Bool
        
        init(dataType: DataType, shareLevel: ShareLevel) {
            self.dataType = dataType
            self.shareLevel = shareLevel
            self.authorizedUsers = []
            self.allowPublicGraph = false
        }
        
        access(contract) fun updateShareLevel(level: ShareLevel) {
            self.shareLevel = level
        }
        
        access(contract) fun addAuthorizedUser(user: Address) {
            if !self.authorizedUsers.contains(user) {
                self.authorizedUsers.append(user)
            }
        }
        
        access(contract) fun removeAuthorizedUser(user: Address) {
            if let index = self.authorizedUsers.firstIndex(of: user) {
                self.authorizedUsers.remove(at: index)
            }
        }
        
        access(contract) fun setPublicGraphPermission(allow: Bool) {
            self.allowPublicGraph = allow
        }
    }
    
    access(all) struct HealthDataAccess {
        access(all) let requester: Address
        access(all) let dataType: DataType
        access(all) let timestamp: UFix64
        access(all) let purpose: String
        
        init(requester: Address, dataType: DataType, purpose: String) {
            self.requester = requester
            self.dataType = dataType
            self.timestamp = getCurrentBlock().timestamp
            self.purpose = purpose
        }
    }
    
    access(all) resource PrivacyManager {
        access(all) var privacySettings: {DataType: PrivacySetting}
        access(all) var accessLog: [HealthDataAccess]
        access(all) var familyMembers: [Address]
        access(all) var medicalProviders: [Address]
        access(all) var publicGraphIds: [String]
        
        init() {
            self.privacySettings = {}
            self.accessLog = []
            self.familyMembers = []
            self.medicalProviders = []
            self.publicGraphIds = []
            
            // Initialize default privacy settings
            for dataType in [DataType.Sleep, DataType.Steps, DataType.HeartRate, 
                           DataType.BloodPressure, DataType.Weight, DataType.Goals, DataType.Rewards] {
                self.privacySettings[dataType] = PrivacySetting(dataType: dataType, shareLevel: ShareLevel.Private)
            }
        }
        
        access(all) fun updatePrivacySetting(dataType: DataType, shareLevel: ShareLevel) {
            if self.privacySettings[dataType] == nil {
                self.privacySettings[dataType] = PrivacySetting(dataType: dataType, shareLevel: shareLevel)
            } else {
                self.privacySettings[dataType]!.updateShareLevel(level: shareLevel)
            }
            
            emit PrivacySettingsUpdated(
                user: self.owner?.address ?? panic("No owner"), 
                setting: dataType.rawValue.toString(), 
                value: shareLevel == ShareLevel.Public
            )
        }
        
        access(all) fun addFamilyMember(address: Address) {
            if !self.familyMembers.contains(address) {
                self.familyMembers.append(address)
                
                // Add to authorized users for family-level data
                for dataType in self.privacySettings.keys {
                    if self.privacySettings[dataType]!.shareLevel == ShareLevel.Family {
                        self.privacySettings[dataType]!.addAuthorizedUser(user: address)
                    }
                }
            }
        }
        
        access(all) fun addMedicalProvider(address: Address) {
            if !self.medicalProviders.contains(address) {
                self.medicalProviders.append(address)
                
                // Add to authorized users for medical-level data
                for dataType in self.privacySettings.keys {
                    if self.privacySettings[dataType]!.shareLevel == ShareLevel.Medical {
                        self.privacySettings[dataType]!.addAuthorizedUser(user: address)
                    }
                }
            }
        }
        
        access(all) fun checkAccess(requester: Address, dataType: DataType, purpose: String): Bool {
            let setting = self.privacySettings[dataType] ?? panic("Privacy setting not found")
            
            // Log access attempt
            let accessAttempt = HealthDataAccess(
                requester: requester,
                dataType: dataType,
                purpose: purpose
            )
            self.accessLog.append(accessAttempt)
            
            // Check permissions based on share level
            switch setting.shareLevel {
                case ShareLevel.Private:
                    return requester == self.owner?.address
                case ShareLevel.Family:
                    return requester == self.owner?.address || self.familyMembers.contains(requester)
                case ShareLevel.Medical:
                    return requester == self.owner?.address || 
                           self.familyMembers.contains(requester) ||
                           self.medicalProviders.contains(requester)
                case ShareLevel.Public:
                    return true
                default:
                    return false
            }
        }
        
        access(all) fun authorizeDataShare(recipient: Address, dataType: DataType) {
            if self.checkAccess(requester: recipient, dataType: dataType, purpose: "Data sharing authorization") {
                emit HealthDataShared(
                    user: self.owner?.address ?? panic("No owner"),
                    recipient: recipient,
                    dataType: dataType.rawValue.toString()
                )
            }
        }
        
        access(all) fun publishToPublicGraph(graphId: String, dataTypes: [DataType]) {
            // Check if all requested data types allow public graph publishing
            for dataType in dataTypes {
                let setting = self.privacySettings[dataType] ?? panic("Privacy setting not found")
                if !setting.allowPublicGraph {
                    panic("Data type ".concat(dataType.rawValue.toString()).concat(" not authorized for public graph"))
                }
            }
            
            self.publicGraphIds.append(graphId)
            emit PublicGraphPublished(user: self.owner?.address ?? panic("No owner"), graphId: graphId)
        }
        
        access(all) fun enablePublicGraph(dataType: DataType) {
            if self.privacySettings[dataType] == nil {
                self.privacySettings[dataType] = PrivacySetting(dataType: dataType, shareLevel: ShareLevel.Private)
            }
            self.privacySettings[dataType]!.setPublicGraphPermission(allow: true)
        }
        
        access(all) fun getPrivacySetting(dataType: DataType): PrivacySetting? {
            return self.privacySettings[dataType]
        }
        
        access(all) fun getAccessLog(): [HealthDataAccess] {
            return self.accessLog
        }
        
        access(all) fun getFamilyMembers(): [Address] {
            return self.familyMembers
        }
        
        access(all) fun getMedicalProviders(): [Address] {
            return self.medicalProviders
        }
    }
    
    access(all) fun createPrivacyManager(): @PrivacyManager {
        return <- create PrivacyManager()
    }
    
    init() {
        self.PrivacyStoragePath = /storage/HealthPrivacyManager
        self.PrivacyPublicPath = /public/HealthPrivacyManager
    }
}