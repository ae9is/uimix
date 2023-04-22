import { useContext } from "react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { twMerge } from "tailwind-merge";
import FontPicker from 'react-fontpicker-ts';
import 'react-fontpicker-ts/dist/index.css';
import { Mixed, sameOrMixed } from "@uimix/foundation/src/utils/Mixed";
import { Selectable } from "@uimix/model/src/models";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { projectState } from "../../../../state/ProjectState";
import { SelectOption } from "@uimix/foundation/src/components/Select";
import './InspectorFontPicker.css';

export const InspectorFontPicker = observer(function InspectorFontPicker({
  className,
  get,
  set,
  options,
}: {
  className?: string;
  get: (selectable: Selectable) => string | undefined;
  set: (selectable: Selectable, value?: string) => void;
  options?: readonly SelectOption<string>[];
}) {
  const selectables = useContext(InspectorTargetContext);
  const value = sameOrMixed(selectables.map((s) => get(s)));

  return (
    <FontPicker
      className={twMerge(
        `fontpicker 
         relative
         outline-0 w-full h-7 bg-macaron-uiBackground rounded
         focus-within:ring-1 ring-inset ring-macaron-active text-macaron-text text-macaron-base`,
        className
      )}
      googleFonts={options?.map((option: SelectOption<string>) => option.value)}
      defaultValue={value === Mixed ? "Mixed" : undefined}
      value={action((value: string) => {
        for (const selectable of selectables) {
          set(selectable, value);
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});
