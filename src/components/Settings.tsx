import { WalletType } from '@horizonx/aptos-wallet-connector'
import Image from 'next/image'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { CHAIN_INFO, WALLET_INFO } from 'src/constants'
import { useSettings } from 'src/hooks/useSettings'
import { useWallet } from 'src/hooks/useWallet'
import {
  darkGrey,
  jetBlack,
  smokyBlack,
  tiffany,
  trueBlack,
} from 'src/styles/colors'
import {
  fontFamilyHeading,
  fontWeightBold,
  fontWeightMedium,
} from 'src/styles/fonts'
import { getNodeUrls } from 'src/utils/chain'
import styled from 'styled-components'
import { WalletButton } from './parts/Button'
import { InputWithDatalist } from './parts/Input'
import { InvalidChainWarning } from './parts/Message'

export const Settings: FC = () => {
  const { account, chainId, signer, connect } = useWallet()
  const { values, updateValues } = useSettings()

  const nodeUrls = getNodeUrls(chainId)
  const methods = useForm()

  return (
    <Section>
      <FormProvider {...methods}>
        <div>
          <span>Signer</span>
          {account && (
            <code>
              {account}
              {chainId != null &&
                `\nChain ID: ${chainId} (${
                  CHAIN_INFO[chainId]?.name || 'Unknown'
                })`}
            </code>
          )}
          {values.chainId && chainId && values.chainId != chainId && (
            <InvalidChainWarning chainId={values.chainId} />
          )}
          <WalletsDiv>
            {Object.keys(WALLET_INFO).map((key) => {
              const { imageSrc, label } = WALLET_INFO[key as WalletType]
              return (
                <WalletButton
                  key={key}
                  onClick={async () => connect(key as WalletType)}
                  disabled={signer?.type === key}
                >
                  <Image src={imageSrc} alt={label} width={24} height={24} />
                  {label}
                </WalletButton>
              )
            })}
          </WalletsDiv>
        </div>
        <label>
          <span>Chain ID</span>
          {values.chainId && (
            <code>{`Chain ID: ${values.chainId} (${
              CHAIN_INFO[values.chainId]?.name || 'Unknown'
            })`}</code>
          )}
          <InputDiv>
            <InputWithDatalist
              listId="chain-ids"
              options={Object.keys(CHAIN_INFO).map((chainId) => ({
                value: chainId,
                label: `${CHAIN_INFO[+chainId].name} (ChainId: ${chainId})`,
              }))}
              {...methods.register('chainId', {
                setValueAs: (val) =>
                  !val || Number.isNaN(+val) ? undefined : +val,
              })}
            />
            <button
              onClick={() => {
                const newChainId = methods.getValues('chainId')
                updateValues({ chainId: newChainId })
                methods.setValue('chainId', '')
              }}
            >
              Apply
            </button>
          </InputDiv>
        </label>
        <label>
          <span>Account</span>
          {values.account && <code>{values.account}</code>}
          <InputDiv>
            <input {...methods.register('account')} />
            <button
              disabled={!values.chainId && !values.nodeUrl && !chainId}
              onClick={() => {
                updateValues({ account: methods.getValues('account') })
                methods.setValue('account', '')
              }}
            >
              Load
            </button>
          </InputDiv>
        </label>
        <label>
          <span>Node URL (Optional)</span>
          {values.nodeUrl && <code>{values.nodeUrl}</code>}
          <InputDiv>
            <InputWithDatalist
              options={nodeUrls}
              listId="node-urls"
              {...methods.register('nodeUrl')}
            />
            <button
              onClick={() => {
                const newNodeUrl = methods.getValues('nodeUrl')
                updateValues({ nodeUrl: newNodeUrl })
                methods.setValue('nodeUrl', '')
              }}
            >
              Apply
            </button>
          </InputDiv>
        </label>
      </FormProvider>
    </Section>
  )
}

const WalletsDiv = styled.div``

const InputDiv = styled.div`
  padding: 12px;
  border-radius: 6px;
  background: ${smokyBlack};
  input {
    flex: 1;
  }
  button {
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: ${fontWeightMedium};
    background: ${darkGrey};
    :disabled {
      opacity: 0.5;
    }
    transition: background, color, 0.2s ease-in-out;
    :enabled:hover,
    :enabled:focus {
      background: ${tiffany};
      color: ${jetBlack};
    }
  }
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 52px;
  label,
  > div {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    span {
      font-size: 20px;
      font-family: ${fontFamilyHeading};
      font-weight: ${fontWeightBold};
    }
    div {
      display: flex;
      align-items: center;
      column-gap: 8px;
    }
  }
  ${WalletsDiv} {
    margin-top: 8px;
  }
  code {
    padding: 12px 16px;
    background: ${trueBlack};
    font-size: 14px;
    white-space: pre-wrap;
  }
`
