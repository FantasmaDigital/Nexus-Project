import { PaymentMethod, PaymentStatus, TypeDocumentToPrint, UniqueDocumentType } from "../enums/payment.enum";

export const defaultInfoShipping = (currentTime: any) => {
    return {
        invoiceType: TypeDocumentToPrint.CF.id,
        sellerName: 'Vendedor',
        issueDate: currentTime.toLocaleDateString('es-SV'),
        issueTime: currentTime.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        client: {
            name: "Contado",
            documentType: UniqueDocumentType.DUI.name,
            documentNumber: UniqueDocumentType.DUI.defaultValue,
            email: "clientes@empresa.com",
            address: "San Salvador",
            department: "San Salvador",
            municipality: "San Salvador Centro",
            phone: "0000-0000"
        },
        items: [],
        nonTaxableAmounts: [],
        specialTaxes: [],
        operationCondition: "Contado",
        paymentMethod: PaymentMethod.CASH,
        status: PaymentStatus.PENDING,
        observations: "",
        ivaRetention: 0,
    }
}