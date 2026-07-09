import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// 定数として静的なライセンス情報を定義
const DESIGN_LICENSES = [
  { name: "ニコ文字", license: "SIL Open Font License 1.1", type: "font" },
  {
    name: "M PLUS 1 / Rounded Mplus 1c",
    license: "SIL Open Font License 1.1",
    type: "font",
  },
  {
    name: "Zen Maru Gothic",
    license: "SIL Open Font License 1.1",
    type: "font",
  },
  { name: "Nunito", license: "SIL Open Font License 1.1", type: "font" },
  { name: "Simple Design System", license: "CC BY 4.0", type: "design" },
  {
    name: "Material Symbols and Icons",
    license: "Apache License 2.0",
    type: "design",
  },
  {
    name: "Spring Boot / MyBatis",
    license: "Apache License 2.0",
    type: "backend",
  },
  { name: "MySQL Connector/J", license: "GPL-2.0", type: "backend" },
  { name: "jBCrypt / JJWT", license: "ISC / Apache 2.0", type: "backend" },
];

// バックエンドライブラリ
const BACKEND_LICENSES = [
  {
    name: "Spring Boot / MyBatis",
    license: "Apache License 2.0",
    type: "バックエンド",
  },
  { name: "MySQL Connector/J", license: "GPL-2.0", type: "バックエンド" },
  { name: "jBCrypt / JJWT", license: "ISC / Apache 2.0", type: "バックエンド" },
];

export default function License() {
  const [npmLicenses, setNpmLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getLicenses = async () => {
      try {
        const response = await fetch("/data/licenses.json");
        const data = await response.json();
        // npmパッケージ名の整形
        const formatted = Object.entries(data).map(([key, value]) => ({
          name: key.substring(0, key.lastIndexOf("@")),
          license: value.licenses,
        }));
        setNpmLicenses(formatted.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("ライセンスの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getLicenses();
  }, []);

  return (
    <div className="p-8 h-full w-full">
      <h1 className="text-2xl font-bold mb-6">ライセンス一覧</h1>

      {isLoading ? (
        <p>読み込み中・・・</p>
      ) : (
        <div className="h-[70vh] border border-gray-200 py-4 rounded-lg overflow-hidden">
          <div className="h-full overflow-y-auto w-full px-4">
            {/* デザイン・フォントセクション */}
            <h2 className="text-lg font-bold mt-4 mb-2 text-blue-600">
              🎨 フォント・デザイン素材
            </h2>
            {DESIGN_LICENSES.map((item) => (
              <div key={item.name} className="mb-2 border-b pb-2">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ライセンス: {item.license}
                </p>
              </div>
            ))}

            {/* バックエンドセクション */}
            <h2 className="text-lg font-bold mt-4 mb-2 text-blue-600">
              🔧 バックエンドライブラリ
            </h2>
            {BACKEND_LICENSES.map((item) => (
              <div key={item.name} className="mb-2 border-b pb-2">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ライセンス: {item.license}
                </p>
              </div>
            ))}

            {/* npmパッケージセクション */}
            <h2 className="text-lg font-bold mt-8 mb-2 text-blue-600">
              📦 フロントエンド依存ライブラリ
            </h2>
            {npmLicenses.map((item) => (
              <div key={item.name} className="mb-2 border-b pb-2">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ライセンス: {item.license}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Button
        variant="secondary"
        icon={
          <span className="inline-block rotate-180">
            <ChevronRightIcon />
          </span>
        }
        onClick={() => navigate(-1)}
        className="mt-8"
      >
        戻る
      </Button>
    </div>
  );
}
