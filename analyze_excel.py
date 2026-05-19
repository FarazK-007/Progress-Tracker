import pandas as pd

xlsx = pd.ExcelFile(r'E:\bg3\Interview_Prep_Tracker.xlsx')
print("=" * 70)
print("TOTAL SHEETS:", len(xlsx.sheet_names))
print("Sheet Names:", xlsx.sheet_names)
print("=" * 70)

for sheet in xlsx.sheet_names:
    df = pd.read_excel(xlsx, sheet)
    sep = "=" * 70
    print("\n" + sep)
    print("SHEET:", sheet)
    print("Rows:", len(df), "| Columns:", len(df.columns))
    print("Columns:", df.columns.tolist())
    print("\nDtypes:")
    print(df.dtypes)
    print("\nNon-null counts:")
    print(df.count())
    print("\nFirst 5 rows:")
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', 200)
    pd.set_option('display.max_colwidth', 40)
    print(df.head(5).to_string())
    print("\nNull summary:")
    print(df.isnull().sum())
    print("\nSample values per column:")
    for col in df.columns:
        unique_vals = df[col].dropna().unique()
        sample = unique_vals[:5].tolist() if len(unique_vals) > 0 else ["(empty)"]
        print(f"  {col}: {sample}")
