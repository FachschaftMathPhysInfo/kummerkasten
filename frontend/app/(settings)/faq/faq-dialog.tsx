"use client";

import React from "react";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {Edit2, PlusCircle} from "lucide-react";
import {QuestionAnswerPair} from "@/lib/graph/generated/graphql";
import QAPForm from "@/app/(settings)/faq/faq-form";

interface QAPDialogProps {
  open: boolean;
  createMode: boolean;
  qap: QuestionAnswerPair | null;
  closeDialog: () => void;
}

export default function QAPDialog(props: QAPDialogProps) {
  return (
    <Dialog open={props.open}>
      <DialogContent className="[&>button]:hidden" data-cy={'faq-dialog'}>
        <DialogTitle className="flex items-center gap-2">
          {props.createMode ? <PlusCircle/> : <Edit2 size={20}/>}
          {props.createMode ? "Frage erstellen" : "Frage bearbeiten"}
        </DialogTitle>
        <QAPForm
          qap={props.qap}
          closeDialog={props.closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
}
