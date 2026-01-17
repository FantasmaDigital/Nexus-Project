import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { useCompanyStore } from '../../../store/product.schema.zod';

// Registro de fuentes para asegurar que los grosores (bold) se vean correctamente
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCOjAkZ98_z3ed32GbS3g.ttff', fontWeight: 'normal' },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UicP74HBfWOC2ndfBne67A.ttff', fontWeight: 'bold' },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica', // Se puede cambiar a 'Inter' si se prefiere
        fontSize: 9,
        color: '#334155',
    },
    // --- Header Section ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        borderBottom: '2 solid #0F172A',
        paddingBottom: 15,
    },
    brandSection: {
        flexDirection: 'column',
        gap: 2,
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    companyDetail: {
        fontSize: 8,
        color: '#64748B',
        marginTop: 1,
    },
    docStatusContainer: {
        alignItems: 'flex-end',
        gap: 4,
    },
    docIdLabel: {
        fontSize: 8,
        color: '#64748B',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    docIdValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    statusBadge: {
        marginTop: 4,
        padding: '3 8',
        borderRadius: 4,
        fontSize: 7,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    // --- Banner ---
    titleBanner: {
        padding: '12 0',
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: '1 solid #E2E8F0',
        borderTop: '1 solid #E2E8F0',
    },
    titleText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0F172A',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    // --- Info Grid ---
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 25,
        border: '1 solid #E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    infoBox: {
        width: '50%',
        padding: '10 15',
        borderBottom: '1 solid #E2E8F0',
        borderRight: '1 solid #E2E8F0',
        backgroundColor: '#FCFDFF',
    },
    infoLabel: {
        fontSize: 6,
        fontWeight: 'bold',
        color: '#64748B',
        textTransform: 'uppercase',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    // --- Table Style ---
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#0F172A',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        padding: '10 8',
        alignItems: 'center',
    },
    tableHeaderText: {
        color: '#FFFFFF',
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1 solid #F1F5F9',
        padding: '10 8',
        alignItems: 'center',
        fontSize: 9,
    },
    colSku: {
        width: '15%',
        paddingRight: 8,
    },
    colDesc: {
        width: '45%',
        paddingRight: 4,
    },
    colQty: { width: '10%', textAlign: 'center' },
    colPrice: { width: '15%', textAlign: 'right' },
    colTotal: { width: '15%', textAlign: 'right' },
    // --- Totals ---
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 0,
    },
    totalContainer: {
        width: '35%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#F8FAFC',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        border: '1 solid #E2E8F0',
        borderTop: '0',
    },
    // --- Signatures ---
    signatureWrapper: {
        position: 'absolute',
        bottom: 80,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    sigBox: {
        width: '28%',
        alignItems: 'center',
    },
    sigLine: {
        width: '100%',
        borderTop: '1 solid #0F172A',
        marginBottom: 5,
    },
    sigText: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    // --- Footer ---
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTop: '1 solid #E2E8F0',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#94A3B8',
        fontSize: 7,
    }
});

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export const TransferPDF = ({ transfer }: { transfer: any }) => {
    const { company } = useCompanyStore.getState();
    const items = transfer.items || [];

    const totalAmount = items.reduce((acc: number, item: any) => {
        const p = parseFloat(item.details?.Precio || item.details?.precio || 0);
        return acc + (p * (item.qty || 0));
    }, 0);

    const statusMap: Record<string, string> = {
        enviado: '#3B82F6',
        recibido: '#10B981',
        anulado: '#EF4444',
        default: '#64748B'
    };

    return (
        <Document title={`Traslado-${transfer.id}`}>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.brandSection}>
                        <Text style={styles.companyName}>{company?.name || 'NEXUS ERP'}</Text>
                        <Text style={styles.companyDetail}>NIT: {company?.nit || 'N/A'}</Text>
                        <Text style={styles.companyDetail}>NRC: {company?.nrc || 'N/A'}</Text>
                        <Text style={styles.companyDetail}>GIRO: {company?.giro || 'N/A'}</Text>
                        <Text style={styles.companyDetail}>DIRECCIÓN: {company?.address || 'N/A'}</Text>
                        <Text style={styles.companyDetail}>TEL: {company?.phone || 'N/A'} • EMAIL: {company?.email || 'N/A'}</Text>
                    </View>
                    <View style={styles.docStatusContainer}>
                        <Text style={styles.docIdLabel}>MOVIMIENTO DE INVENTARIO</Text>
                        <Text style={styles.docIdValue}>#{transfer.id?.split('-')[0].toUpperCase()}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusMap[transfer.status] || statusMap.default }]}>
                            <Text>{transfer.status || 'PENDIENTE'}</Text>
                        </View>
                    </View>
                </View>

                {/* Sub-Header Banner */}
                <View style={styles.titleBanner}>
                    <Text style={styles.titleText}>Control Interno de Movimiento de Inventario</Text>
                </View>

                {/* Metadata Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Fecha de Emisión</Text>
                        <Text style={styles.infoValue}>{transfer.createdAt?.split('T')[0] || '---'}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Responsable</Text>
                        <Text style={styles.infoValue}>{transfer.senderName || 'No asignado'}</Text>
                    </View>
                    <View style={[styles.infoBox, { borderBottom: 0 }]}>
                        <Text style={styles.infoLabel}>Origen</Text>
                        <Text style={styles.infoValue}>{transfer.sourceWarehouse || '---'}</Text>
                    </View>
                    <View style={[styles.infoBox, { borderBottom: 0, borderRight: 0 }]}>
                        <Text style={styles.infoLabel}>Destino</Text>
                        <Text style={styles.infoValue}>{transfer.targetWarehouse || '---'}</Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader} fixed>
                        <Text style={[styles.tableHeaderText, styles.colSku]}>SKU</Text>
                        <Text style={[styles.tableHeaderText, styles.colDesc]}>Descripción del Producto</Text>
                        <Text style={[styles.tableHeaderText, styles.colQty]}>Cant.</Text>
                        <Text style={[styles.tableHeaderText, styles.colPrice]}>P. Unit</Text>
                        <Text style={[styles.tableHeaderText, styles.colTotal]}>Subtotal</Text>
                    </View>

                    {items.map((item: any, i: number) => {
                        const price = parseFloat(item.details?.Precio || item.details?.precio || 0);
                        return (
                            <View key={i} style={styles.tableRow} wrap={false}>
                                <Text style={[styles.colSku, { fontWeight: 'bold' }]}>{item.details?.SKU || item.details?.sku || item.sku || 'N/A'}</Text>
                                <Text style={styles.colDesc}>{item.details?.Nombre || item.details?.nombre || 'Producto sin nombre'}</Text>
                                <Text style={styles.colQty}>{item.qty}</Text>
                                <Text style={styles.colPrice}>{formatCurrency(price)}</Text>
                                <Text style={styles.colTotal}>{formatCurrency(price * item.qty)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Summary Section */}
                <View style={styles.totalSection}>
                    <View style={styles.totalContainer}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10 }}>TOTAL</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, color: '#0F172A' }}>
                            {formatCurrency(totalAmount)}
                        </Text>
                    </View>
                </View>

                {/* Notes */}
                {transfer.notes && (
                    <View style={{ marginTop: 20, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 4 }}>
                        <Text style={styles.infoLabel}>Observaciones</Text>
                        <Text style={{ fontSize: 8, lineHeight: 1.4, color: '#475569' }}>{transfer.notes}</Text>
                    </View>
                )}

                {/* Signatures */}
                <View style={styles.signatureWrapper} wrap={false}>
                    <View style={styles.sigBox}>
                        <View style={styles.sigLine} />
                        <Text style={styles.sigText}>Despachado</Text>
                        <Text style={{ fontSize: 6, color: '#94A3B8' }}>Firma del remitente</Text>
                    </View>
                    <View style={styles.sigBox}>
                        <View style={styles.sigLine} />
                        <Text style={styles.sigText}>Autorizado</Text>
                        <Text style={{ fontSize: 6, color: '#94A3B8' }}>Sello de gerencia</Text>
                    </View>
                    <View style={styles.sigBox}>
                        <View style={styles.sigLine} />
                        <Text style={styles.sigText}>Recibido</Text>
                        <Text style={{ fontSize: 6, color: '#94A3B8' }}>Firma de destino</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text>Nexus ERP Systems - Comprobante de Traslado Interno</Text>
                    <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
};