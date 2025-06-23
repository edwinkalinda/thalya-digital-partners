
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building, Plus, Edit, Trash2 } from 'lucide-react';
import { Business } from '@/types/ai-config';

interface BusinessManagerProps {
  onBusinessesChange?: (businesses: Business[]) => void;
}

export const BusinessManager = ({ onBusinessesChange }: BusinessManagerProps) => {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({
    name: '',
    type: '',
    address: '',
    phone: '',
    email: ''
  });

  const businessTypes = [
    'Restaurant', 'Clinique', 'Dentiste', 'Hôtel', 'Hôpital', 
    'Immobilier', 'Salon de coiffure', 'SPA', 'Garage', 'Autre'
  ];

  // Simuler le chargement des businesses existants
  useEffect(() => {
    const mockBusinesses: Business[] = [
      {
        id: '1',
        name: 'Restaurant Le Gourmet',
        type: 'Restaurant',
        address: '123 Rue de la Paix, Paris',
        phone: '+33 1 23 45 67 89',
        email: 'contact@legourmet.fr',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Clinique Saint-Louis',
        type: 'Clinique',
        address: '456 Avenue de la Santé, Lyon',
        phone: '+33 4 78 90 12 34',
        email: 'reception@clinique-st-louis.fr',
        createdAt: '2024-01-10'
      },
      {
        id: '3',
        name: 'Restaurant La Brasserie',
        type: 'Restaurant',
        address: '789 Boulevard Central, Marseille',
        phone: '+33 4 91 23 45 67',
        email: 'info@labrasserie.fr',
        createdAt: '2024-01-20'
      }
    ];
    setBusinesses(mockBusinesses);
    onBusinessesChange?.(mockBusinesses);
  }, [onBusinessesChange]);

  const handleCreateBusiness = () => {
    if (!newBusiness.name || !newBusiness.type) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le nom et le type de business",
        variant: "destructive"
      });
      return;
    }

    const business: Business = {
      id: Date.now().toString(),
      name: newBusiness.name!,
      type: newBusiness.type!,
      address: newBusiness.address || '',
      phone: newBusiness.phone || '',
      email: newBusiness.email || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedBusinesses = [...businesses, business];
    setBusinesses(updatedBusinesses);
    onBusinessesChange?.(updatedBusinesses);
    setIsCreating(false);
    setNewBusiness({ name: '', type: '', address: '', phone: '', email: '' });

    toast({
      title: "Business créé",
      description: `${business.name} a été ajouté avec succès`,
    });
  };

  const handleDeleteBusiness = (id: string) => {
    const businessName = businesses.find(b => b.id === id)?.name;
    const updatedBusinesses = businesses.filter(b => b.id !== id);
    setBusinesses(updatedBusinesses);
    onBusinessesChange?.(updatedBusinesses);
    
    toast({
      title: "Business supprimé",
      description: `${businessName} a été supprimé`,
    });
  };

  const handleUpdateBusiness = (updatedBusiness: Business) => {
    const updatedBusinesses = businesses.map(b => 
      b.id === updatedBusiness.id ? updatedBusiness : b
    );
    setBusinesses(updatedBusinesses);
    onBusinessesChange?.(updatedBusinesses);
    setEditingBusiness(null);
    
    toast({
      title: "Business mis à jour",
      description: `${updatedBusiness.name} a été modifié`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Mes Businesses ({businesses.length})
          </CardTitle>
          <Button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau Business
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Liste des businesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="p-4 border-2 rounded-lg border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{business.name}</h3>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingBusiness(business)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBusiness(business.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{business.type}</p>
              {business.address && (
                <p className="text-xs text-gray-500 mb-1">{business.address}</p>
              )}
              {business.phone && (
                <p className="text-xs text-gray-500">{business.phone}</p>
              )}
              <span className="text-xs text-gray-400">
                Créé: {business.createdAt}
              </span>
            </div>
          ))}
        </div>

        {/* Formulaire de création */}
        {isCreating && (
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Créer un nouveau business</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom du business *</Label>
                  <Input
                    value={newBusiness.name || ''}
                    onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                    placeholder="Ex: Restaurant Le Gourmet"
                  />
                </div>
                <div>
                  <Label>Type de business *</Label>
                  <Select value={newBusiness.type || ''} onValueChange={(value) => setNewBusiness({ ...newBusiness, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Adresse</Label>
                <Input
                  value={newBusiness.address || ''}
                  onChange={(e) => setNewBusiness({ ...newBusiness, address: e.target.value })}
                  placeholder="123 Rue de la Paix, Paris"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={newBusiness.phone || ''}
                    onChange={(e) => setNewBusiness({ ...newBusiness, phone: e.target.value })}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={newBusiness.email || ''}
                    onChange={(e) => setNewBusiness({ ...newBusiness, email: e.target.value })}
                    placeholder="contact@business.fr"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateBusiness}>Créer le Business</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Annuler</Button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'édition */}
        {editingBusiness && (
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Modifier {editingBusiness.name}</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom du business</Label>
                  <Input
                    value={editingBusiness.name}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Type de business</Label>
                  <Select value={editingBusiness.type} onValueChange={(value) => setEditingBusiness({ ...editingBusiness, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Adresse</Label>
                <Input
                  value={editingBusiness.address || ''}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={editingBusiness.phone || ''}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editingBusiness.email || ''}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleUpdateBusiness(editingBusiness)}>Sauvegarder</Button>
                <Button variant="outline" onClick={() => setEditingBusiness(null)}>Annuler</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
