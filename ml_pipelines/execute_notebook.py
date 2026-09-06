import nbformat
from nbclient import NotebookClient

def execute_and_save():
    nb_path = 'ml_pipelines/startup_model_training.ipynb'
    print(f"Reading {nb_path}...")
    with open(nb_path, 'r', encoding='utf-8') as f:
        nb = nbformat.read(f, as_version=4)

    client = NotebookClient(nb, timeout=600, kernel_name='python3')
    print("Executing notebook cells... This will generate all plots and compute metrics...")
    client.execute()

    with open(nb_path, 'w', encoding='utf-8') as f:
        nbformat.write(nb, f)
    print(f"Successfully executed and saved populated notebook with all visualizations to {nb_path}!")

if __name__ == '__main__':
    execute_and_save()
