import os

def rename_auto_files():
    """
    Renomme tous les fichiers du répertoire courant qui contiennent 'auto' dans leur nom.
    Le nouveau nom commence par 'auto' suivi du nom original sans 'auto'.
    """
    # Obtenir la liste de tous les fichiers dans le répertoire courant
    current_directory = os.getcwd()
    files = os.listdir(current_directory)
    
    renamed_count = 0
    
    for filename in files:
        # Vérifier si le fichier contient 'auto' dans son nom
        if 'auto' in filename.lower():
            # Créer le nouveau nom
            # 1. Supprimer 'auto' du nom original (insensible à la casse)
            new_name = filename.replace('auto', '').replace('Auto', '').replace('AUTO', '')
            
            # 2. Ajouter 'auto' au début
            new_name = 'auto' + new_name
            
            # Vérifier que le fichier existe et que le nouveau nom est différent
            old_path = os.path.join(current_directory, filename)
            new_path = os.path.join(current_directory, new_name)
            
            if os.path.isfile(old_path) and filename != new_name:
                try:
                    # Renommer le fichier
                    os.rename(old_path, new_path)
                    print(f"Renommé: '{filename}' → '{new_name}'")
                    renamed_count += 1
                except OSError as e:
                    print(f"Erreur lors du renommage de '{filename}': {e}")
    
    if renamed_count == 0:
        print("Aucun fichier contenant 'auto' n'a été trouvé ou renommé.")
    else:
        print(f"\n{renamed_count} fichier(s) renommé(s) avec succès.")

if __name__ == "__main__":
    print("Script de renommage des fichiers contenant 'auto'")
    print("=" * 50)
    
    # Afficher le répertoire courant
    print(f"Répertoire courant: {os.getcwd()}")
    print()
    
    # Demander confirmation
    response = input("Voulez-vous continuer ? (o/n): ")
    if response.lower() in ['o', 'oui', 'y', 'yes']:
        rename_auto_files()
    else:
        print("Opération annulée.")
