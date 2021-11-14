function Row({
    uuid,
    title,
    titleClassName,
    selected,
    buttonIcon,
    onSelected,
    onClick,
    ignoreSelectedStyle,
    ...props
}) {
    const selectedClasses = selected && !ignoreSelectedStyle ? ' active list-active' : '';
    
    return (
        <li className="flex-row w-100 nav-item mt-1" data-key={uuid} key={uuid} {...props}>
            <button className={"nav-link link-dark" + selectedClasses} onClick={onClick}>
                {buttonIcon &&
                    <img src={buttonIcon} alt="" width="18" className="me-1" />
                }
                <span className={titleClassName}>{title}</span>
            </button>
            {selected && 
                <div>
                    {onSelected()}
                </div>
            }
        </li>
    );
}

export default Row;