import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Calculator } from "../target/types/calculator";
import assert from "assert";

describe("calculator", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local()
  // const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);
  // anchor.setProvider(anchor.AnchorProvider.env());

  const calculator = anchor.web3.Keypair.generate();

  // const program = anchor.workspace.Calculator as Program<Calculator>;
  const program = anchor.workspace.Calculator;

  it("Creates a calculator", async () => {
    // await program.methods.create("Welcome to Solana", {
    await program.rpc.create("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [calculator]
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.greeting === "Welcome to Solana");
  })

  it("Adds two numbers", async() => {
    // await program.methods.add(new anchor.BN(2), new anchor.BN(3), {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result === new anchor.BN(5));
  })

});
