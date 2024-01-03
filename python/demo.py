import requests
import time
import os

from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_account import Account
from dotenv import load_dotenv
load_dotenv()

url = 'http://localhost:8545'
submission_url = 'https://bsc-builder.blocksmith.org'
simulation_url = 'https://bsc-simulation.blocksmith.org'


def attach_flashbots(
    w3,
    signature_account,
    endpoint_uri,
):
    """
    Injects the flashbots module and middleware to w3.
    """
    from web3._utils.module import attach_modules
    from flashbots import Flashbots
    from flashbots import construct_flashbots_middleware
    from flashbots import FlashbotProvider

    s = requests.Session()
    s.headers.update({'authorization': os.getenv('AUTHORIZATION')})
    flashbots_provider = FlashbotProvider(
        signature_account, endpoint_uri, session=s)

    flash_middleware = construct_flashbots_middleware(flashbots_provider)
    w3.middleware_onion.add(flash_middleware)

    # attach modules to add the new namespace commands
    attach_modules(w3, {"flashbots": (Flashbots,)})


def create_w3_for_bundle_simulation(account):
    w3 = Web3(Web3.HTTPProvider(url))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    attach_flashbots(w3, account, simulation_url)
    return w3


def create_w3_for_bundle_submission(account):
    w3 = Web3(Web3.HTTPProvider(url))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    attach_flashbots(w3, account, submission_url)
    return w3


def main():
    private_key = os.getenv('PRIV_KEY')
    account = Account.from_key(private_key)
    w3 = create_w3_for_bundle_submission(account)
    sim_w3 = create_w3_for_bundle_simulation(account)

    nonce = w3.eth.get_transaction_count(account.address)

    # Create a transaction
    tx = {
        'to': account.address,
        'value': 0,
        'gas': 21000,
        'gasPrice': w3.toWei('3', 'gwei'),
        'nonce': nonce,
        'chainId': w3.eth.chainId
    }

    # Sign the transaction
    signed_tx = account.sign_transaction(tx)
    bundle = [
        {"signed_transaction": signed_tx.rawTransaction},
    ]

    # Simulate the bundle
    target = sim_w3.eth.blockNumber + 1
    simulated = sim_w3.flashbots.simulate(bundle, target)
    print("bundle simulated:")
    print(simulated)

    # Send the bundle
    rsp = w3.flashbots.send_bundle(bundle, target)
    print("bundle sent")
    rsp.wait()


if __name__ == '__main__':
    main()
