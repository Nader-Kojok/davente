'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Trash2,
  Key,
  Phone,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AccountLayout from '@/components/AccountLayout';
import TextInput from '@/components/ui/TextInput';
import PasswordInput from '@/components/ui/PasswordInput';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import toast from 'react-hot-toast';

// Options pour les paramètres
const languageOptions = [
  { value: 'fr', label: 'Français' },
  { value: 'wo', label: 'Wolof' },
  { value: 'en', label: 'English' },
];

const timezoneOptions = [
  { value: 'Africa/Dakar', label: 'Dakar (GMT+0)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
];

export default function ParametresPage() {
  const { user, isAuthenticated, signOut, profile, updateProfile } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  
  // Paramètres du compte
  const [accountSettings, setAccountSettings] = useState({
    language: 'fr',
    timezone: 'Africa/Dakar',
    isActive: true,
  });

  // Paramètres de sécurité
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Paramètres de notification
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  });

  // Paramètres de confidentialité
  const [privacySettings, setPrivacySettings] = useState({
    showPhone: true,
    showEmail: false,
    allowSms: true,
    allowCalls: true
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (profile) {
      setAccountSettings({
        language: profile.language || 'fr',
        timezone: profile.timezone || 'Africa/Dakar',
        isActive: profile.is_active ?? true,
      });

      setNotificationSettings({
        emailNotifications: profile.email_notifications ?? true,
        smsNotifications: profile.sms_notifications ?? true,
        pushNotifications: profile.push_notifications ?? true,
        marketingEmails: profile.marketing_emails ?? false
      });

      setPrivacySettings({
        showPhone: profile.show_phone ?? true,
        showEmail: profile.show_email ?? false,
        allowSms: profile.allow_sms ?? true,
        allowCalls: profile.allow_calls ?? true
      });
    }
  }, [isAuthenticated, profile, router]);

  const handleAccountSettingsUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(accountSettings)
      });

      if (response.ok) {
        toast.success('Paramètres du compte mis à jour avec succès');
        // Profile will be updated automatically through Supabase realtime
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSettingsUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(notificationSettings)
      });

      if (response.ok) {
        toast.success('Préférences de notification mises à jour avec succès');
        // Profile will be updated automatically through Supabase realtime
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacySettingsUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(privacySettings)
      });

      if (response.ok) {
        toast.success('Paramètres de confidentialité mis à jour avec succès');
        // Profile will be updated automatically through Supabase realtime
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        toast.success('Mot de passe modifié avec succès');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver votre compte ? Vous pourrez le réactiver plus tard.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: false })
      });

      if (response.ok) {
        toast.success('Compte désactivé avec succès');
        await signOut();
        router.push('/');
      } else {
        toast.error('Erreur lors de la désactivation');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('⚠️ ATTENTION : Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est IRRÉVERSIBLE.')) {
      return;
    }

    const confirmation = prompt('Pour confirmer la suppression définitive, tapez "SUPPRIMER DÉFINITIVEMENT" :');
    if (confirmation !== 'SUPPRIMER DÉFINITIVEMENT') {
      toast.error('Confirmation incorrecte');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Compte supprimé définitivement');
        await signOut();
        router.push('/');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'account', label: 'Paramètres du compte', icon: Settings, description: 'Langue, fuseau horaire, statut' },
    { id: 'security', label: 'Sécurité', icon: Shield, description: 'Mot de passe, authentification' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email, SMS, push' },
    { id: 'privacy', label: 'Confidentialité', icon: Eye, description: 'Visibilité, contact' },
    { id: 'danger', label: 'Zone de danger', icon: AlertTriangle, description: 'Désactivation, suppression' },
    { id: 'help', label: 'Aide', icon: HelpCircle, description: 'Support, FAQ' }
  ];

  return (
    <AccountLayout 
      title="Paramètres" 
      description="Gérez vos préférences et paramètres de compte"
    >
      {/* Actions en haut à droite */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div></div> {/* Spacer */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Se déconnecter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Sidebar Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden lg:sticky lg:top-6">
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible lg:space-y-1 space-x-1 lg:space-x-0 p-1 lg:p-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex-shrink-0 lg:w-full flex items-center justify-between px-3 lg:px-4 py-3 lg:py-4 text-left transition-colors rounded lg:rounded-none whitespace-nowrap ${
                      activeSection === item.id
                        ? 'bg-primary-50 text-primary-700 lg:border-r-4 lg:border-primary-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <Icon className={`w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 mt-0.5 ${
                        item.id === 'danger' ? 'text-red-500' : ''
                      }`} />
                      <div className="hidden lg:block">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      </div>
                      <div className="lg:hidden text-xs font-medium">
                        {item.label.split(' ')[0]}
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0 hidden lg:block" />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            
            {/* Paramètres du compte */}
            {activeSection === 'account' && (
              <div>
                <div className="flex items-center mb-6">
                  <Settings className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Paramètres du compte</h2>
                    <p className="text-gray-600">Configurez vos préférences générales</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Langue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue préférée
                    </label>
                    <Select
                      name="language"
                      value={accountSettings.language}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, language: e.target.value }))}
                      options={languageOptions}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      La langue utilisée pour l'interface et les notifications
                    </p>
                  </div>

                  {/* Fuseau horaire */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuseau horaire
                    </label>
                    <Select
                      name="timezone"
                      value={accountSettings.timezone}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      options={timezoneOptions}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisé pour l'affichage des dates et heures
                    </p>
                  </div>

                  {/* Statut du compte */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800">Compte actif</h3>
                        <p className="text-sm text-green-700">
                          Votre compte est actif et toutes les fonctionnalités sont disponibles
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAccountSettingsUpdate}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Mise à jour...' : 'Sauvegarder les paramètres'}
                  </button>
                </div>
              </div>
            )}

            {/* Sécurité */}
            {activeSection === 'security' && (
              <div>
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
                    <p className="text-gray-600">Protégez votre compte avec un mot de passe fort</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Informations de sécurité */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Téléphone</h3>
                          <p className="text-sm text-gray-600">
                            {user.phone_confirmed_at ? (
                              <span className="text-green-600">✓ Vérifié</span>
                            ) : (
                              <span className="text-yellow-600">En attente</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Email</h3>
                          <p className="text-sm text-gray-600">
                            {user.email_confirmed_at ? (
                              <span className="text-green-600">✓ Vérifié</span>
                            ) : (
                              <span className="text-yellow-600">En attente</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Changement de mot de passe */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Key className="w-5 h-5 mr-2" />
                      Changer le mot de passe
                    </h3>
                    
                    <div className="space-y-4">
                      <PasswordInput
                        label="Mot de passe actuel"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Votre mot de passe actuel"
                      />
                      
                      <PasswordInput
                        label="Nouveau mot de passe"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Nouveau mot de passe (min. 6 caractères)"
                      />
                      
                      <PasswordInput
                        label="Confirmer le nouveau mot de passe"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirmer le nouveau mot de passe"
                      />
                      
                      <button
                        onClick={handlePasswordChange}
                        disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div>
                <div className="flex items-center mb-6">
                  <Bell className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                    <p className="text-gray-600">Choisissez comment vous souhaitez être notifié</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Checkbox
                    name="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    label="Notifications par email"
                    description="Recevoir des notifications importantes par email"
                  />
                  
                  <Checkbox
                    name="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    label="Notifications par SMS"
                    description="Recevoir des notifications par SMS"
                  />
                  
                  <Checkbox
                    name="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                    label="Notifications push"
                    description="Recevoir des notifications sur votre appareil"
                  />
                  
                  <Checkbox
                    name="marketingEmails"
                    checked={notificationSettings.marketingEmails}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, marketingEmails: e.target.checked }))}
                    label="Emails marketing"
                    description="Recevoir des offres et promotions par email"
                  />
                  
                  <button
                    onClick={handleNotificationSettingsUpdate}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
                  </button>
                </div>
              </div>
            )}

            {/* Confidentialité */}
            {activeSection === 'privacy' && (
              <div>
                <div className="flex items-center mb-6">
                  <Eye className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Confidentialité</h2>
                    <p className="text-gray-600">Contrôlez la visibilité de vos informations</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      Visibilité des informations
                    </h3>
                    <div className="space-y-4">
                      <Checkbox
                        name="showPhone"
                        checked={privacySettings.showPhone}
                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, showPhone: e.target.checked }))}
                        label="Afficher mon numéro de téléphone"
                        description="Votre numéro sera visible sur vos annonces"
                      />
                      
                      <Checkbox
                        name="showEmail"
                        checked={privacySettings.showEmail}
                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, showEmail: e.target.checked }))}
                        label="Afficher mon adresse email"
                        description="Votre email sera visible sur votre profil public"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      Préférences de contact
                    </h3>
                    <div className="space-y-4">
                      <Checkbox
                        name="allowCalls"
                        checked={privacySettings.allowCalls}
                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowCalls: e.target.checked }))}
                        label="Accepter les appels téléphoniques"
                        description="Les acheteurs pourront vous appeler directement"
                      />
                      
                      <Checkbox
                        name="allowSms"
                        checked={privacySettings.allowSms}
                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowSms: e.target.checked }))}
                        label="Accepter les SMS"
                        description="Recevoir des messages par SMS"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePrivacySettingsUpdate}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
                  </button>
                </div>
              </div>
            )}

            {/* Zone de danger */}
            {activeSection === 'danger' && (
              <div>
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-red-600">Zone de danger</h2>
                    <p className="text-gray-600">Actions irréversibles sur votre compte</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Désactivation du compte */}
                  <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <h3 className="text-lg font-medium text-yellow-800 mb-2">
                      Désactiver le compte
                    </h3>
                    <p className="text-sm text-yellow-700 mb-4">
                      Désactivez temporairement votre compte. Vous pourrez le réactiver plus tard en vous reconnectant.
                      Vos annonces seront masquées mais conservées.
                    </p>
                    <button
                      onClick={handleDeactivateAccount}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-200 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
                    >
                      <EyeOff className="w-4 h-4 mr-2" />
                      Désactiver mon compte
                    </button>
                  </div>

                  {/* Suppression du compte */}
                  <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <h3 className="text-lg font-medium text-red-800 mb-2">
                      Supprimer définitivement le compte
                    </h3>
                    <p className="text-sm text-red-700 mb-4">
                      ⚠️ <strong>ATTENTION :</strong> Cette action est <strong>IRRÉVERSIBLE</strong>. 
                      Toutes vos données, annonces et informations seront définitivement supprimées. 
                      Vous ne pourrez pas récupérer votre compte.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer définitivement mon compte
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Aide */}
            {activeSection === 'help' && (
              <div>
                <div className="flex items-center mb-6">
                  <HelpCircle className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Aide et support</h2>
                    <p className="text-gray-600">Trouvez de l'aide et contactez notre support</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="/faq"
                    className="block p-6 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-700">FAQ</h3>
                    <p className="text-sm text-gray-500 mt-1">Questions fréquemment posées</p>
                  </a>
                  
                  <a
                    href="/contact"
                    className="block p-6 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-700">Contactez-nous</h3>
                    <p className="text-sm text-gray-500 mt-1">Besoin d'aide ? Contactez notre équipe</p>
                  </a>
                  
                  <a
                    href="/help"
                    className="block p-6 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-700">Centre d'aide</h3>
                    <p className="text-sm text-gray-500 mt-1">Guides et tutoriels</p>
                  </a>
                  
                  <a
                    href="/terms"
                    className="block p-6 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-700">Conditions d'utilisation</h3>
                    <p className="text-sm text-gray-500 mt-1">Nos conditions et politiques</p>
                  </a>
                </div>

                {/* Informations de contact */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Email :</strong> support@Grabi.sn</p>
                    <p><strong>Téléphone :</strong> +221 33 123 45 67</p>
                    <p><strong>Heures d'ouverture :</strong> Lundi - Vendredi, 9h - 18h</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
} 