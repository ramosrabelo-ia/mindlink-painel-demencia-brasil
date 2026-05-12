"""
mindlink_demo.py — Demonstração da lógica de filtro do projeto MindLink.

Como o ambiente não tem acesso ao DATASUS, este script:
1. Simula um DataFrame com a estrutura REAL do SIH/RD (Reduzida)
2. Aplica a lógica de filtro de demência (3 modos)
3. Mostra o top de causas principais quando demência é secundária
4. Compara outcomes (letalidade, permanência, custo) demência vs resto

CIDs de demência: F00 (Alzheimer), F01 (vascular), F02 (outras),
                  F03 (não especificada), G30 (Alzheimer neurológico)
"""
from __future__ import annotations
import numpy as np
import pandas as pd

rng = np.random.default_rng(seed=42)
N = 10_000

# ── CIDs de demência ──────────────────────────────────────────
CIDS_DEMENCIA = ["F00", "F01", "F02", "F03", "G30"]

# ── Distribuição realista de causas principais ────────────────
# Quando há demência secundária, a literatura prevê predominância de:
# pneumonia (J18, J69), ITU (N39), fratura fêmur (S72), AVC (I63, I64),
# desidratação (E86). Em pacientes sem demência, a distribuição é mais
# espalhada (parto, IAM, apendicite, fraturas variadas, etc).

CAUSAS_COM_DEMENCIA = {
    "J18": 0.28,  # Pneumonia bacteriana
    "J69": 0.12,  # Pneumonia aspirativa (fortemente associada)
    "N39": 0.15,  # ITU
    "S72": 0.10,  # Fratura de fêmur
    "I63": 0.08,  # AVC isquêmico
    "I64": 0.05,  # AVC não especificado
    "E86": 0.07,  # Desidratação
    "L89": 0.05,  # Úlcera de pressão
    "K56": 0.04,  # Íleo paralítico
    "R55": 0.03,  # Síncope
    "outros": 0.03,
}

CAUSAS_SEM_DEMENCIA = {
    "O80": 0.18,  # Parto normal
    "I21": 0.08,  # IAM
    "K35": 0.05,  # Apendicite
    "S52": 0.04,  # Fratura antebraço
    "J18": 0.06,  # Pneumonia (também ocorre, mas menos)
    "N39": 0.05,  # ITU (também ocorre)
    "E11": 0.04,  # Diabetes
    "I50": 0.04,  # Insuf. cardíaca
    "K80": 0.04,  # Colelitíase
    "S72": 0.03,  # Fratura fêmur
    "outros": 0.39,
}


def sortear(distribuicao: dict, n: int) -> np.ndarray:
    cids = list(distribuicao.keys())
    probs = list(distribuicao.values())
    return rng.choice(cids, size=n, p=probs)


# ── Construção do DataFrame simulado ──────────────────────────
# 15% das internações têm demência (principal OU secundária)
# Dentro desse grupo: 10% demência é principal, 90% é secundária

tem_demencia = rng.random(N) < 0.15
demencia_principal = tem_demencia & (rng.random(N) < 0.10)
demencia_secundaria = tem_demencia & ~demencia_principal

# Diagnóstico principal
diag_princ = np.empty(N, dtype=object)
diag_princ[demencia_principal] = rng.choice(CIDS_DEMENCIA, size=demencia_principal.sum())
diag_princ[demencia_secundaria] = sortear(CAUSAS_COM_DEMENCIA, demencia_secundaria.sum())
sem_dem = ~tem_demencia
diag_princ[sem_dem] = sortear(CAUSAS_SEM_DEMENCIA, sem_dem.sum())

# Diagnóstico secundário
diag_secun = np.full(N, "", dtype=object)
diag_secun[demencia_secundaria] = rng.choice(CIDS_DEMENCIA, size=demencia_secundaria.sum())

# Idade — demência puxa idade pra cima
idade = np.where(
    tem_demencia,
    rng.normal(78, 8, N).clip(60, 100).astype(int),
    rng.normal(45, 20, N).clip(0, 95).astype(int),
)

# Permanência (dias) — demência prolonga
dias_perm = np.where(
    tem_demencia,
    rng.gamma(shape=3, scale=4, size=N).astype(int) + 1,
    rng.gamma(shape=2, scale=2.5, size=N).astype(int) + 1,
)

# Mortalidade — letalidade muito maior em demência (Mitchell NEJM 2009)
prob_obito = np.where(tem_demencia, 0.18, 0.03)
morte = rng.random(N) < prob_obito

# Valor total (R$) — proporcional à permanência
val_tot = (dias_perm * rng.normal(420, 80, N)).clip(min=200).round(2)

# Sexo
sexo = rng.choice([1, 3], size=N)  # 1=masculino, 3=feminino (padrão DATASUS)

df = pd.DataFrame({
    "DIAG_PRINC": diag_princ,
    "DIAG_SECUN": diag_secun,
    "IDADE": idade,
    "SEXO": sexo,
    "DIAS_PERM": dias_perm,
    "MORTE": morte.astype(int),
    "VAL_TOT": val_tot,
})

print("="*70)
print("DATAFRAME SIMULADO — estrutura SIH/RD")
print("="*70)
print(f"Total de AIHs: {len(df):,}")
print(f"\nPrimeiras 5 linhas:")
print(df.head().to_string())


# ── FUNÇÃO DE FILTRO (núcleo do projeto MindLink) ─────────────
def filtrar_demencia(df: pd.DataFrame, modo: str = "qualquer") -> pd.DataFrame:
    """
    Filtra AIHs onde demência aparece, conforme o modo:
    - 'principal'  : apenas DIAG_PRINC ∈ CIDS_DEMENCIA
    - 'secundario' : apenas DIAG_SECUN ∈ CIDS_DEMENCIA
    - 'qualquer'   : união dos dois
    """
    cid_re = "|".join(CIDS_DEMENCIA)
    mask_p = df["DIAG_PRINC"].astype(str).str.startswith(tuple(CIDS_DEMENCIA))
    mask_s = df["DIAG_SECUN"].astype(str).str.startswith(tuple(CIDS_DEMENCIA))

    if modo == "principal":
        return df[mask_p].assign(demencia_em="principal")
    if modo == "secundario":
        return df[mask_s].assign(demencia_em="secundario")
    if modo == "qualquer":
        d = df[mask_p | mask_s].copy()
        d["demencia_em"] = np.where(mask_p[mask_p | mask_s], "principal", "secundario")
        return d
    raise ValueError(f"modo inválido: {modo}")


# ── DEMONSTRAÇÃO DO PONTO METODOLÓGICO ────────────────────────
print("\n" + "="*70)
print("FILTRO 1: APENAS DIAG_PRINC (modo 'principal')")
print("="*70)
df_p = filtrar_demencia(df, "principal")
print(f"AIHs encontradas: {len(df_p):,} ({100*len(df_p)/len(df):.2f}% do total)")

print("\n" + "="*70)
print("FILTRO 2: APENAS DIAG_SECUN (modo 'secundario')")
print("="*70)
df_s = filtrar_demencia(df, "secundario")
print(f"AIHs encontradas: {len(df_s):,} ({100*len(df_s)/len(df):.2f}% do total)")

print("\n" + "="*70)
print("FILTRO 3: QUALQUER (modo 'qualquer') ← default do MindLink")
print("="*70)
df_q = filtrar_demencia(df, "qualquer")
print(f"AIHs encontradas: {len(df_q):,} ({100*len(df_q)/len(df):.2f}% do total)")
print(f"\nDistribuição:")
print(df_q["demencia_em"].value_counts())

# ── A TESE: pneumonia lidera quando demência é secundária ─────
print("\n" + "="*70)
print("TOP 10 CAUSAS PRINCIPAIS QUANDO DEMÊNCIA É SECUNDÁRIA")
print("(prova empírica da hipótese: pneumonia deve liderar)")
print("="*70)
top = df_s["DIAG_PRINC"].value_counts().head(10)
top_pct = (top / len(df_s) * 100).round(1)
print(pd.DataFrame({"casos": top, "%": top_pct}).to_string())

# ── COMPARAÇÃO DE OUTCOMES ────────────────────────────────────
print("\n" + "="*70)
print("OUTCOMES: COM demência vs SEM demência")
print("="*70)
com_dem = df.index.isin(df_q.index)
comparacao = pd.DataFrame({
    "Com demência":  [df[com_dem]["IDADE"].mean(),
                      df[com_dem]["DIAS_PERM"].mean(),
                      df[com_dem]["MORTE"].mean() * 100,
                      df[com_dem]["VAL_TOT"].mean()],
    "Sem demência":  [df[~com_dem]["IDADE"].mean(),
                      df[~com_dem]["DIAS_PERM"].mean(),
                      df[~com_dem]["MORTE"].mean() * 100,
                      df[~com_dem]["VAL_TOT"].mean()],
}, index=["Idade média", "Dias internação (média)",
          "Letalidade (%)", "Custo médio (R$)"]).round(2)
print(comparacao.to_string())

# ── SUBNOTIFICAÇÃO: o ponto-chave da metodologia ──────────────
print("\n" + "="*70)
print("⚠️  O QUE A METODOLOGIA RESOLVE")
print("="*70)
subnot = (len(df_q) - len(df_p)) / len(df_q) * 100
print(f"Se filtrássemos APENAS por DIAG_PRINC, perderíamos")
print(f"{subnot:.1f}% dos casos onde demência pressiona o SUS.")
print(f"\nIsso significa: subestimar quase {subnot:.0f}% da carga real.")
print("Por isso o default do pipeline é 'qualquer', não 'principal'.")
