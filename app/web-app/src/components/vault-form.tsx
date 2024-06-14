"use client";
import {z} from "zod";

const createVaultFormSchema = z.object({
    fundingTokenAddress:z.string(),
    votingTokenAddress:z.string(),
    minRequestableAmount:z.number(),
    maxRequestableAmount:z.number(),
    tallyDate:z.string(),
})

export default function VaultForm(){
    return (
        <div>
            Create Vault Form.
        </div>
    )
}