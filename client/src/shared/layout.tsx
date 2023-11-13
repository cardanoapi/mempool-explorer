export default function Layout({ className = '', ...props }: any) {
    return (
        <div className={`px-4 py-6 lg:px-10 lg:py-8 ${className}`} {...props}>
            {props.children}
        </div>
    );
}
