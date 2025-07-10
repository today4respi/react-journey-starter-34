import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Eye, Trash2, FileText, Download } from 'lucide-react';
import { adminFileService, AdminPdf } from '@/services/adminFileService';
import { useToast } from '@/hooks/use-toast';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const FilesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    pdfId: string;
    filename: string;
  }>({
    isOpen: false,
    pdfId: '',
    filename: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pdfsData, isLoading, error } = useQuery({
    queryKey: ['admin-pdfs'],
    queryFn: adminFileService.getAllPdfs
  });

  const handleDeletePdf = (pdfId: string, filename: string) => {
    setDeleteModal({
      isOpen: true,
      pdfId,
      filename
    });
  };

  const confirmDeletePdf = async () => {
    const result = await adminFileService.deletePdf(deleteModal.pdfId);
    
    if (result.success) {
      toast({
        title: "Fichier supprimé",
        description: "Le fichier PDF a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-pdfs'] });
    } else {
      toast({
        title: "Erreur",
        description: result.message || "Erreur lors de la suppression du fichier",
        variant: "destructive",
      });
    }
    
    setDeleteModal({
      isOpen: false,
      pdfId: '',
      filename: ''
    });
  };

  const handleViewPdf = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const handleDownloadPdf = (pdfUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des fichiers...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !pdfsData?.success) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erreur lors du chargement des fichiers
          </div>
        </CardContent>
      </Card>
    );
  }

  const pdfs = pdfsData.data || [];

  // Filter PDFs based on search term
  const filteredPdfs = pdfs.filter((pdf: AdminPdf) => 
    pdf.original_filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPdfTypeLabel = (type: string) => {
    return type === 'cover' ? 'Couverture' : 'Contenu';
  };

  const getPdfTypeBadgeVariant = (type: string) => {
    return type === 'cover' ? 'default' : 'secondary';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Fichiers PDF ({filteredPdfs.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, commande, client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPdfs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Aucun fichier trouvé pour cette recherche' : 'Aucun fichier uploadé'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du fichier</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date d'upload</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPdfs.map((pdf: AdminPdf) => (
                    <TableRow key={pdf.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span>{pdf.original_filename}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPdfTypeBadgeVariant(pdf.pdf_type)}>
                          {getPdfTypeLabel(pdf.pdf_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pdf.order_number || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{pdf.customer_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{pdf.customer_email || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(pdf.uploaded_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPdf(pdf.pdf_url)}
                            title="Visualiser le PDF"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadPdf(pdf.pdf_url, pdf.original_filename)}
                            title="Télécharger le PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePdf(pdf.id, pdf.original_filename)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Supprimer le PDF"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, pdfId: '', filename: '' })}
        onConfirm={confirmDeletePdf}
        title="Supprimer le fichier PDF"
        description="Êtes-vous sûr de vouloir supprimer ce fichier PDF ?"
        itemName={deleteModal.filename}
      />
    </>
  );
};

export default FilesTable;
