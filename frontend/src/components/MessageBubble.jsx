import React from "react";

function renderInlineMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-black text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function FormattedMessageText({ text }) {
  const lines = text.split("\n");
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({
        type: "list",
        items: listItems,
      });
      listItems = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      return;
    }

    flushList();

    const isShortTitle =
      line.length <= 55 &&
      !line.endsWith(".") &&
      !line.endsWith(",") &&
      !line.includes("?") &&
      !line.includes("¿");

    if (isShortTitle) {
      blocks.push({
        type: "title",
        text: line.replaceAll("**", ""),
      });
    } else {
      blocks.push({
        type: "paragraph",
        text: line,
      });
    }
  });

  flushList();

  return (
    <div className="space-y-4 text-sm leading-7 text-slate-700">
      {blocks.map((block, index) => {
        if (block.type === "title") {
          return (
            <h3
              key={index}
              className="mt-2 text-sm font-black uppercase tracking-wide text-teal-800"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="space-y-2 pl-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  <span>{renderInlineMarkdown(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-sm leading-7 text-slate-700">
            {renderInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export function MessageBubble({ message }) {
  const isUser = message.role === "user";

  const validSources = (message.sources ?? []).filter(
    (source) => source.documentName || source.sectionTitle || source.pageNumber
  );

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl border px-4 py-4 shadow-sm sm:max-w-[80%] sm:rounded-[26px] sm:px-6 sm:py-5 lg:max-w-[72%] ${
          isUser
            ? "border-teal-300 bg-gradient-to-br from-cyan-50 to-teal-50 text-slate-900"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <p
          className={`mb-3 text-xs font-bold uppercase tracking-wider ${
            isUser ? "text-teal-700" : "text-slate-400"
          }`}
        >
          {isUser ? "Consulta" : "Respuesta del tutor"}
        </p>

        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
            {message.text}
          </p>
        ) : (
          <FormattedMessageText text={message.text ?? ""} />
        )}

        {!isUser && validSources.length > 0 && (
          <div className="mt-5 rounded-2xl border border-teal-200 bg-gradient-to-r from-cyan-50 to-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Fuentes utilizadas
            </p>

            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              {validSources.map((source, index) => (
                <li
                  key={source.chunkId ?? `${source.documentId}-${index}`}
                  className="rounded-xl bg-white/80 px-3 py-2"
                >
                  <span className="font-semibold text-slate-800">
                    {source.documentName ?? "Documento del curso"}
                  </span>

                  {source.sectionTitle && (
                    <span> · {source.sectionTitle}</span>
                  )}

                  {source.pageNumber && (
                    <span> · pág. {source.pageNumber}</span>
                  )}

                  {typeof source.similarityScore === "number" && (
                    <span>
                      {" "}
                      · similitud {(source.similarityScore * 100).toFixed(1)}%
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}