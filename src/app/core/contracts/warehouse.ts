export interface Warehouse {
    externalId: string | null,
    name: string,
    username: string,
    type: string,
    erpCode: string,
    address: {
        street: string | null,
        district: string | null,
        zipCode: string | null,
        city: string | null,
        country: string | null
    },
    contactInfo: {
        name: string | null,
        email: string | null,
        phone: string | null
    },
    returnToWarehouse: boolean,
    returnToMainWarehouse: boolean,
    [key: string]: any,
    businessId: string,
    businessName: string
}
