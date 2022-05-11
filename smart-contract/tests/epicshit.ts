import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Epicshit } from "../target/types/epicshit";

describe("epicshit", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Epicshit as Program<Epicshit>;
  let _account;
  it("Start stuff off!", async () => {
    // Add your test here.
    const baseAccount = anchor.web3.Keypair.generate();

    const tx = await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchor.AnchorProvider.env().wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }, signers: [baseAccount]
    });
    console.log("Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log(`GIF account: ${account.totalGifs.toString()}`)

    _account = baseAccount;
  });

  it("Add gif", async () => {
    const baseAccount = _account;
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    let totalGifs = account.totalGifs;
    const tx = await program.rpc.addGif("https://media.giphy.com/media/tIZUToOMEFGM0/giphy.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchor.AnchorProvider.env().wallet.publicKey,
      }
    })
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.equal(account.totalGifs.toNumber(), totalGifs.toNumber() + 1)
    assert.equal(account.gifList[0].gifLink, "https://media.giphy.com/media/tIZUToOMEFGM0/giphy.gif")
    console.log(`GIF account: ${account.totalGifs.toString()}`)
    console.log(account.gifList)

  });


});
