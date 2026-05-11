import Image from 'next/image'
import Link from 'next/link'

export default function NavBar() {
  return (
    <header>
        <nav>
            <Link href="/" className={'logo'}>
                <Image src="/icons/logo.png" width={24} height={24} alt="devEvent logo"/>
                <p>devEvent</p>
            </Link>
            <ul>
                <Link href="/">home</Link>
                <Link href="/">events</Link>
                <Link href="/">create events</Link>
            </ul>
        </nav>
    </header>
  )
}
